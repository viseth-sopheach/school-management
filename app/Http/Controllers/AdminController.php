<?php

namespace App\Http\Controllers;

use http\Client\Curl\User;
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

   public function store(Request $req)
   {
      $val = $req->validate([
         'name' => 'required|string|max:255',
         'email' => 'required|string|email|max:255|unique:users',
         'password' => 'required|string|min:3|confirmed',
      ]);
      $user = User::create([
         'name' => $val['name'],
         'email' => $val['email'],
         'password' => $val['password'],
      ]);
      return response()->json([
         'message' => 'User created',
         'user' => $user
      ]);
   }

   public function update(Request $request, User $user)
   {
      $val = $request->validate([
         'role' => 'required:exists:users,role',
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
