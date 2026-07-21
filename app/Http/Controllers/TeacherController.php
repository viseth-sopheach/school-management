<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\StudentInfoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
   public function index(Request $request, int $classId)
   {
      $class = ClassModel::with('students')->findOrFail($classId);
      return response()->json([
         'class' => $class
      ]);
   }

   public function me(Request $id)
   {
      $user = Auth::user($id);
      return response()->json([
         'me' => $user
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
      ]);

      $student = DB::transaction(function () use ($validate) {
         $user = User::create([
            'name' => $validate['name'],
            'email' => $validate['email'],
            'password' => $validate['password'],
            'role' => 'student',
         ]);

         return StudentInfoModel::create([
            'user_id' => $user->id,
            'name' => $validate['name'],
            'gender' => $validate['gender'],
            'dob' => $validate['dob'],
         ]);
      });

      return response()->json([
         'student created' => $student
      ]);
   }

   public function score(Request $req)
   {
      $val = $req->validate([
         'C++_score' => 'required|float',
         'C_score' => 'required|float',
      ]);
      $val = StudentInfoModel::create($val);
      return response()->json([
         'student score' => $val
      ]);
   }

   public function update(Request $req, int $id)
   {
      $val = $req->validate([
         'name' => 'string|max:255',
         'gender' => 'in:male,female',
         'dob' => 'date',
         'Cpp_score' => 'required|float',
         'C_score' => 'required|float',
      ]);
      $student = StudentInfoModel::find($id);
      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }
      if (isset($val['name'])) {
         $student->name = $val['name'];
      }
      if (isset($val['gender'])) {
         $student->gender = $val['gender'];
      }
      if (isset($val['dob'])) {
         $student->dob = $val['dob'];
      }
      if (isset($val['Cpp_score'])) {
         $student->{'Cpp_score'} = $val['Cpp_score'];
      }
      if (isset($val['C_score'])) {
         $student->C_score = $val['C_score'];
      }
      $student->update();
      return response()->json([
         'student updated' => $student
      ]);
   }

   public function delete(int $id)
   {
      $student = StudentInfoModel::find($id);
      if (!$student) {
         return response()->json(['message' => 'Student not found'], 404);
      }
      if ($student) {
         $student->delete();
         return response()->json(['message' => 'Student deleted']);
      }
   }
}
