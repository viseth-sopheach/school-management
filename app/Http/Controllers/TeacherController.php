<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\StudentInfoModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

      $class->load('students');

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

      // if a class was specified, make sure teacher owns class
      if (!empty($validate['class_id'])) {
         $class = ClassModel::find($validate['class_id']);

         if (!$class || $class->teacher_id !== $req->user()->id) {
            abort(403, 'You are not authorized to add students to this class.');
         }
      }

      $student = DB::transaction(function () use ($validate) {
         $user = User::create([
            'name' => $validate['name'],
            'email' => $validate['email'],
            'password' => $validate['password'],
            'role' => 'student',
         ]);

         return StudentInfoModel::create([
            'user_id' => $user->id,
            'class_id' => $validate['class_id'] ?? null,
            'name' => $validate['name'],
            'gender' => $validate['gender'],
            'dob' => $validate['dob'],
         ]);
      });

      return response()->json([
         'message' => 'Student created successfully.',
         'student' => $student,
      ]);
   }

   public function availableStudents()
   {
      $students = StudentInfoModel::whereNull('class_id')
         ->get(['id', 'name', 'gender']);

      return response()->json([
         'students' => $students,
      ]);
   }

   public function attachStudent(Request $request, ClassModel $class)
   {
      if ($class->teacher_id !== $request->user()->id) {
         abort(403, 'You are not authorized to modify this class.');
      }

      $val = $request->validate([
         'student_id' => 'required|integer|exists:student_info,id',
      ]);

      $student = StudentInfoModel::find($val['student_id']);

      if ($student->class_id) {
         return response()->json([
            'message' => 'This student is already enrolled in a class.',
         ], 422);
      }

      $student->update(['class_id' => $class->id]);

      return response()->json([
         'message' => 'Student added to class successfully.',
         'student' => $student,
      ]);
   }

   public function score(Request $req)
   {
      $val = $req->validate([
         'C++_score' => 'required|numeric',
         'C_score' => 'required|numeric',
      ]);
      $val = StudentInfoModel::create($val);
      return response()->json([
         'student score' => $val,
      ]);
   }

   public function update(Request $req, int $id)
   {
      $val = $req->validate([
         'name' => 'string|max:255',
         'gender' => 'in:Male,Female',
         'dob' => 'date',
         'Cpp_score' => 'nullable|numeric',
         'C_score' => 'nullable|numeric',
      ]);

      $student = StudentInfoModel::find($id);
      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }

      $student->fill($val);
      if ($student->Cpp_score !== null && $student->C_score !== null) {
         $student->grade = ($student->Cpp_score + $student->C_score) / 2;
      }
      $student->save();

      if (isset($val['name']) && $student->user_id) {
         $student->user()->update(['name' => $val['name']]);
      }

      return response()->json([
         'student updated' => $student,
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
      $student = StudentInfoModel::with('classes')->find($studentId);

      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }

      $isOwnClass = $student->classes && $student->classes->teacher_id === $request->user()->id;

      if (!$isOwnClass) {
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

   // remove a student from the teacher's class without deleting the student record
   public function removeStudentFromClass(Request $request, ClassModel $class, StudentInfoModel $student)
   {
      if ($class->teacher_id !== $request->user()->id) {
         abort(403, 'You are not authorized to modify this class.');
      }

      if ($student->class_id !== $class->id) {
         abort(404, 'This student is not enrolled in this class.');
      }

      $student->update(['class_id' => null]);

      return response()->json([
         'message' => 'Student removed from class successfully.',
      ]);
   }
}
