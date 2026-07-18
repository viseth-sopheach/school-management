<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use function Laravel\Prompts\password;

//use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
   public function me(Request $request, int $id)
   {
      Auth::user();
      $user = User::find($id);
      return response()->json([
         'me' => $user
      ]);
   }

   public function register(Request $request)
   {
      $validated = $request->validate([
         'name' => 'required|string|max:255',
         'email' => 'required|email|unique:users,email',
         'password' => 'required|min:3',
         'role' => 'required|in:admin,teacher,student',
      ]);

      $user = User::create([
         'name' => $validated['name'],
         'email' => $validated['email'],
         'password' => $validated['password'],
         'role' => $validated['role'],
      ]);

      $token = $user->createToken('api-token')->plainTextToken;

      return response()->json([
         'message' => 'User registered successfully',
         'user' => $user,
         'token' => $token,
      ], 201);
   }

   public function login(Request $request)
   {
      $request->validate([
         'email' => 'required|email',
         'password' => 'required',
      ]);

      if (!Auth::attempt($request->only('email', 'password'))) {
         return response()->json(['message' => 'Invalid credentials'], 401);
      }

      $user = Auth::user();
      $token = $user->createToken('api-token')->plainTextToken;

      return response()->json([
         'user' => $user,
         'token' => $token,
      ]);
   }

   public function logout(Request $request)
   {
      $request->user()->currentAccessToken()->delete();
      return response()->json(['message' => 'Logged out successfully']);
   }

   public function updateProfile(Request $request)
   {
      $validate = $request->validate([
         'name' => 'string|max:255',
         'password' => 'min:3',
      ]);
      $user = Auth::user();
      $user->update($validate);
      return response()->json([
         'message' => 'Profile updated successfully',
      ]);
   }
}
