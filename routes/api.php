<?php

use App\Http\Controllers\AuthController;
use \App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\AdminController;

// admin
Route::prefix('admin')->controller(AdminController::class)->group(function () {
   Route::get('/', 'index');
   Route::get('/getUsers', 'getAllUsers');
   Route::post('/createClass', 'store');
   Route::put('/update', 'update');
   Route::delete('/delete', 'delete');
});

// teacher
Route::middleware('auth:sanctum')->group(function () {
   Route::prefix('teacher')->controller(TeacherController::class)->group(function () {
      Route::get('/', 'index');
      Route::post('addStudent', 'addStudent');
      Route::post('insertScore', 'score');
      Route::put('/update', 'update');
      Route::delete('/delete', 'delete');
   });
});

// normal user
Route::prefix('acc')->controller(AuthController::class)->group(function () {
   Route::post('/register', 'register');
   Route::post('/login', 'login');
   Route::middleware('auth:sanctum')->group(function () {
      Route::get('/me/{id}', 'me');
      Route::put('/update', 'update');
      Route::delete('/delete', 'delete');
      Route::post('/logout', 'logout');
   });
});
