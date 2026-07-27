<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\SubjectModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\ScoreModel;
use App\Models\StudentInfoModel;

class AdminController extends Controller
{
   public function index()
   {
      $user = User::all();
      return response()->json([
         'user' => $user
      ]);
   }

   public function show(ClassModel $class)
   {
      $class->load(['subjects', 'students.scores', 'teacher:id,name,email']);

      return response()->json([
         'class' => $class,
      ]);
   }

   public function getAllUsers()
   {
      $user = User::all();
      return response()->json([
         'user' => $user
      ]);
   }

   public function getTeachers()
   {
      $teachers = User::where('role', 'teacher')->get(['id', 'name', 'email']);

      return response()->json([
         'teachers' => $teachers,
      ]);
   }

   public function getAllClasses()
   {
      $classes = ClassModel::withCount('students')
         ->with(['teacher:id,name,email', 'subjects'])
         ->latest('created_at')
         ->get();

      return response()->json([
         'classes' => $classes,
      ]);
   }

   public function store(Request $req)
   {
      $validated = $req->validate([
         'name' => 'required|string|max:255',
         'teacher_id' => 'nullable|exists:users,id',
         'subjects' => 'required|array|min:1',
         'subjects.*' => 'required|string|max:255|distinct:ignore_case',
      ]);

      $class = DB::transaction(function () use ($validated) {
         $class = ClassModel::create([
            'name' => $validated['name'],
            'teacher_id' => $validated['teacher_id'] ?? null,
         ]);

         $class->subjects()->createMany(
            collect($validated['subjects'])
               ->map(fn(string $subjectName) => ['subject_name' => trim($subjectName)])
         );

         return $class;
      });

      return response()->json([
         'message' => 'Class created',
         'class' => $class->load('teacher', 'subjects'),
      ], 201);
   }

   public function update(Request $request, User $user)
   {
      $val = $request->validate([
         'role' => 'required|in:admin,teacher,student',
      ]);
      $user->update([
         'role' => $val['role'],
      ]);
      return response()->json([
         'message' => 'Role updated successfully',
         'user' => $user,
      ]);
   }

   public function delete(User $user)
   {
      $user->delete();
      return response()->json(['message' => 'User deleted successfully']);
   }

   public function addSubject(Request $req, ClassModel $class)
   {
      $validate = $req->validate([
         'subject_name' => ['required', 'string', 'max:255', Rule::unique('subjects', 'subject_name')->where('class_id', $class->id)],
      ]);
      $subject = $class->subjects()->create([
         'subject_name' => $validate['subject_name'],
      ]);

      return response()->json([
         'message' => 'Subject added successfully',
         'subject' => $subject,
      ]);
   }

   public function updateSubject(Request $req, SubjectModel $subject)
   {
      $validated = $req->validate([
         'subject_name' => ['required', 'string', 'max:255',
            Rule::unique('subjects', 'subject_name')
               ->where('class_id', $subject->class_id)
               ->ignore($subject->id),
         ],
      ]);

      $subject->update(['subject_name' => $validated['subject_name']]);

      return response()->json([
         'message' => 'Subject updated',
         'subject' => $subject,
      ]);
   }

   public function deleteSubject(SubjectModel $subject)
   {
      $subject->delete();

      return response()->json(['message' => 'Subject deleted']);
   }

   public function updateScore(Request $req, int $id)
   {
      $val = $req->validate([
         'scores' => 'required|array|min:1',
         'scores.*' => 'nullable|numeric|min:0|max:100',
      ]);
      $student = StudentInfoModel::find($id);
      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }
      foreach ($val['scores'] as $subjectId => $score) {
         if ($score === null || $score === '') {
            continue;
         }
         ScoreModel::updateOrCreate(
            ['student_info_id' => $student->id, 'subject_id' => $subjectId],
            ['score' => $score]
         );
      }
      $gpaSummary = $student->gpaSummary();
      $student->grade = $gpaSummary['average_score'];
      $student->save();
      return response()->json([
         'student updated' => $student->fresh('scores'),
         'gpa_summary' => $gpaSummary,
      ]);
   }

   public function updateStudent(Request $req, int $id)
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

   public function removeStudentFromClass(ClassModel $class, StudentInfoModel $student)
   {
      if ($student->class_id !== $class->id) {
         abort(404, 'This student is not enrolled in this class.');
      }

      $student->update(['class_id' => null]);

      return response()->json([
         'message' => 'Student removed from class successfully.',
      ]);
   }
}
