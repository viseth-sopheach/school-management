<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
   public function me()
   {
      $user = User::find(Auth::id());
      return response()->json([
         'user' => $user
      ]);
   }

   public function register(Request $request)
   {
      $validated = $request->validate([
         'name' => 'required|string|max:255',
         'email' => 'required|email|unique:users,email',
         'password' => 'required|min:3',
      ]);
      $user = User::create([
         'name' => $validated['name'],
         'email' => $validated['email'],
         'password' => $validated['password'],
      ]);
      return response()->json([
         'message' => 'User registered successfully',
         'user' => $user,
      ], 201);
   }

   public function login(Request $request)
   {
      if (!Auth::attempt($request->only('email', 'password'))) {
         return response()->json([
            'message' => 'Invalid credentials'
         ], 401);
      }
      $user = Auth::user();
      return response()->json([
         'user' => $user
      ]);
   }

   public function logout()
   {
      Auth::logout();
      return response()->json([
         'message' => 'Logged out successfully'
      ]);
   }

   public function update(Request $request)
   {
      $validated = $request->validate([
         'name' => 'nullable|string|max:255',
         'password' => 'nullable|min:3',
      ]);
      $user = Auth::user();
      if (isset($validated['name'])) {
         $user->name = $validated['name'];
      }
      if (isset($validated['password'])) {
         $user->password = $validated['password'];
      }
      $user->save();
      return response()->json([
         'message' => 'user updated,'
      ]);
   }

   public function delete(Request $request)
   {
      Auth::user();
      $user = $request->user();
      $user->delete();
      return response()->json([
         'message' => 'user deleted,'
      ]);
   }
}
