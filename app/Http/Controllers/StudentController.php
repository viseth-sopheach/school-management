<?php

namespace App\Http\Controllers;

use App\Models\StudentInfoModel;
use Illuminate\Http\Request;

class StudentController extends Controller
{
   public function me(Request $request)
   {
      $student = StudentInfoModel::where('user_id', $request->user()->id)->firstOrFail();
      return response()->json(['me' => $student]);
   }

   public function grade(Request $request, int $id)
   {
      $grade = StudentInfoModel::where('id', $id)->value('grade');
      return response()->json([
         'grade' => $grade
      ]);
   }

   public function logout(Request $request, int $id)
   {
      $request->user()->currentAccessToken()->delete();
      return response()->json([
         'message' => 'Successfully logged out'
      ]);
   }
}
