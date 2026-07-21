<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
   public function index()
   {
      $user = User::all();
      return response()->json([
         'user' => $user
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
         ->with('teacher:id,name,email')
         ->latest('created_at')
         ->get();

      return response()->json([
         'classes' => $classes,
      ]);
   }

   public function store(Request $req)
   {
      $val = $req->validate([
         'name' => 'required|string|max:255',
         'teacher_id' => 'nullable|exists:users,id',
      ]);

      $class = ClassModel::create($val);

      return response()->json([
         'message' => 'Class created',
         'class' => $class->load('teacher'),
      ]);
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
      $user = User::findOrFail($user);
      $user->delete();
      return response()->json(['message' => 'User deleted successfully']);
   }
}
