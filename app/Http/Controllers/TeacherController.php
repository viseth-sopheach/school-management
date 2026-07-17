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
         'C++ score' => 'required|float',
         'C score' => 'required|float',
      ]);
      $val = StudentInfoModel::created($val);
      return response()->json([
         'student score' => $val
      ]);
   }

}
