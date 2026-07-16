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
}
