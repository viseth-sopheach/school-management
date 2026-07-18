<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\StudentInfoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherController extends Controller
{
   public function index(Request $id)
   {
      $class = ClassModel::with('students')->find($id);
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
         'gender' => 'required|enum:male,female',
         'dob' => 'required|date',
         'email' => 'required|string|email|max:255|unique:users',
         'password' => 'required|string|min:3|confirmed',
      ]);
      $student = User::create([
         'name' => $validate['name'],
         'gender' => $validate['gender'],
         'dob' => $validate['dob'],
         'email' => $validate['email'],
         'password' => $validate['password'],
      ]);
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
         'C++_score' => 'required|float',
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
      $student->save();
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
