<?php

use App\Http\Controllers\AuthController;
use \App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;


// normal user
Route::prefix('acc')->controller(AuthController::class)->group(function () {
   Route::post('/register', 'register');
   Route::post('/login', 'login');
   Route::middleware('auth:sanctum')->group(function () {
      Route::get('/me/{id}', 'me');
      Route::put('/update', 'update');
      Route::delete('/delete', 'delete');
   });
});

// admin
Route::middleware('auth:sanctum')->group(function () {
   Route::prefix('teacher')->controller(TeacherController::class)->group(function () {

   });
});
