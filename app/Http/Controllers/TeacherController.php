<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\ScoreModel;
use App\Models\StudentInfoModel;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
   public function me(Request $request)
   {
      return response()->json([
         'me' => $request->user(),
      ]);
   }

   public function myClasses(Request $request)
   {
      $classes = ClassModel::withCount('students')
         ->with('subjects')
         ->where('teacher_id', $request->user()->id)
         ->latest('created_at')
         ->get();

      return response()->json([
         'classes' => $classes,
      ]);
   }

   public function show(Request $request, ClassModel $class)
   {
      if ($class->teacher_id !== $request->user()->id) {
         abort(403, 'You are not authorized to view this class.');
      }

      $class->load(['subjects', 'students.scores']);

      return response()->json([
         'class' => $class,
      ]);
   }

   public function addStudent(Request $req)
   {
      $validate = $req->validate([
         'name' => 'required|string|max:255',
         'gender' => 'required|in:Male,Female',
         'dob' => 'required|date',
         'email' => 'required|string|email|max:255|unique:users',
         'password' => 'required|string|min:3|confirmed',
         'class_id' => 'nullable|integer|exists:classes,id',
      ]);

      $class = null;
      if (!empty($validate['class_id'])) {
         $class = ClassModel::find($validate['class_id']);

         if (!$class || $class->teacher_id !== $req->user()->id) {
            abort(403, 'You are not authorized to add students to this class.');
         }
      }

      $student = DB::transaction(function () use ($validate, $class) {
         $user = User::create([
            'name' => $validate['name'],
            'email' => $validate['email'],
            'password' => $validate['password'],
            'role' => 'student',
         ]);

         $studentInfo = StudentInfoModel::create([
            'user_id' => $user->id,
            'name' => $validate['name'],
            'gender' => $validate['gender'],
            'dob' => $validate['dob'],
         ]);

         if ($class) {
            $studentInfo->classes()->attach($class->id);
         }

         return $studentInfo;
      });

      return response()->json([
         'message' => 'Student created successfully.',
         'student' => $student->load('classes'),
      ]);
   }

   /**
    * Return every student account so a teacher can attach any of them to one of their classes, regardless of existing enrollments.
    */
   public function allStudents()
   {
      $students = User::where('role', 'student')
         ->orderBy('name')
         ->get(['id', 'name', 'email']);

      return response()->json([
         'students' => $students,
      ]);
   }

   public function attachStudent(Request $request, ClassModel $class)
   {
      if ($class->teacher_id !== $request->user()->id) {
         abort(403, 'You are not authorized to modify this class.');
      }

      $validated = $request->validate([
         'student_id' => [
            'required',
            'integer',
            Rule::exists('users', 'id')->where('role', 'student'),
         ],
      ]);

      $user = User::findOrFail($validated['student_id']);

      // Lazily create the student's academic profile
      $studentInfo = StudentInfoModel::firstOrCreate(
         ['user_id' => $user->id],
         [
            'name' => $user->name,
            'gender' => 'Male',
            'dob' => '2000-01-01',
            'academic_status' => 'active',
            'certificate_status' => 'pending',
         ]
      );

      $alreadyEnrolled = $class->students()
         ->where('student_info.id', $studentInfo->id)
         ->exists();

      if ($alreadyEnrolled) {
         return response()->json([
            'message' => 'This student is already enrolled in this class.',
         ], 422);
      }

      try {
         $class->students()->attach($studentInfo->id);
      } catch (QueryException $e) {
         // Defends against a race condition where two requests attach
         // the same student to the same class at the same time.
         if ((int)$e->getCode() === 23000) {
            return response()->json([
               'message' => 'This student is already enrolled in this class.',
            ], 422);
         }

         throw $e;
      }

      return response()->json([
         'message' => 'Student added to class successfully.',
         'student' => $studentInfo->fresh(['scores']),
      ]);
   }

   public function update(Request $req, int $id)
   {
      $val = $req->validate([
         'name' => 'string|max:255',
         'gender' => 'in:Male,Female',
         'dob' => 'date',
         'scores' => 'nullable|array',
         'scores.*' => 'nullable|numeric|min:0|max:100',
      ]);

      $student = StudentInfoModel::find($id);
      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }

      $student->fill(collect($val)->except('scores')->all());

      if (!empty($val['scores'])) {
         foreach ($val['scores'] as $subjectId => $score) {
            if ($score === null || $score === '') {
               continue;
            }

            ScoreModel::updateOrCreate(
               ['student_info_id' => $student->id, 'subject_id' => $subjectId],
               ['score' => $score]
            );
         }
      }

      $gpaSummary = $student->gpaSummary();
      $student->grade = $gpaSummary['average_score'];
      $student->save();

      if (isset($val['name']) && $student->user_id) {
         $student->user()->update(['name' => $val['name']]);
      }

      return response()->json([
         'student updated' => $student->fresh('scores'),
         'gpa_summary' => $gpaSummary,
      ]);
   }

   public function delete(int $id)
   {
      $student = StudentInfoModel::find($id);
      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }

      $student->delete();
      return response()->json(['message' => 'Student deleted']);
   }

   public function approveCertificate(Request $request, int $studentId)
   {
      $student = StudentInfoModel::find($studentId);

      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }

      // A teacher may approve a student's certificate
      $teachesThisStudent = $student->classes()
         ->where('teacher_id', $request->user()->id)
         ->exists();

      if (!$teachesThisStudent) {
         return response()->json([
            'message' => "You are not authorized to approve this student's certificate.",
         ], 403);
      }

      if ($student->certificate_status === 'approved') {
         return response()->json([
            'message' => 'Certificate has already been approved.',
            'student' => $student,
         ]);
      }

      $student->update([
         'certificate_status' => 'approved',
         'certificate_approved_at' => now(),
         'certificate_approved_by' => $request->user()->id,
      ]);

      return response()->json([
         'message' => 'Certificate approved successfully.',
         'student' => $student,
      ]);
   }

   public function removeStudentFromClass(Request $request, ClassModel $class, StudentInfoModel $student)
   {
      if ($class->teacher_id !== $request->user()->id) {
         abort(403, 'You are not authorized to modify this class.');
      }

      $isEnrolled = $class->students()
         ->where('student_info.id', $student->id)
         ->exists();

      if (!$isEnrolled) {
         abort(404, 'This student is not enrolled in this class.');
      }

      $class->students()->detach($student->id);

      return response()->json([
         'message' => 'Student removed from class successfully.',
      ]);
   }
}
