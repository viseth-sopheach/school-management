<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use \App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\AdminController;

// auth
Route::controller(AuthController::class)->prefix('auth')->group(function () {
   Route::post('/register', 'register')->name('auth.register');
   Route::post('/login', 'login')->name('auth.login')->middleware('throttle:5,1');
});

Route::middleware('auth:sanctum')->group(function () {
   // Authenticated
   Route::controller(AuthController::class)->prefix('auth')->group(function () {
      Route::get('/me', 'me')->name('auth.me');
      Route::put('/profile', 'updateProfile')->name('auth.profile.update');
      Route::post('/logout', 'logout')->name('auth.logout');
   });

   // Admin
   Route::middleware('role:admin')->prefix('admin')->controller(AdminController::class)->group(function () {
      Route::get('/', 'index')->name('admin.dashboard');
      Route::get('/users', 'getAllUsers')->name('admin.users.index');
      Route::get('/teachers', 'getTeachers')->name('admin.teachers.index');
      Route::get('/classes', 'getAllClasses')->name('admin.classes.index');
      Route::post('/classes', 'store')->name('admin.classes.store');
      Route::put('/users/{user}', 'update')->name('admin.users.update');
      Route::delete('/users/{user}', 'delete')->name('admin.users.destroy');
   });

   // Teacher
   Route::middleware('role:teacher')->prefix('teacher')->controller(TeacherController::class)->group(function () {
      Route::get('/', 'index')->name('teacher.dashboard');
      Route::get('/me', 'me')->name('teacher.me');
      Route::post('/students', 'addStudent')->name('teacher.students.store');
      Route::post('/scores', 'score')->name('teacher.scores.store');
      Route::put('/{id}', 'update')->name('teacher.update');
      Route::delete('/{id}', 'delete')->name('teacher.destroy');
      Route::put('/students/{studentId}/certificate/approve', 'approveCertificate')
         ->name('teacher.certificate.approve')
         ->where('studentId', '[0-9]+');
   });

   // Student
   Route::middleware('role:student')->prefix('student')->controller(StudentController::class)->group(function () {
      Route::get('/me', 'me')->name('student.me');
      Route::get('/dashboard', 'dashboard')->name('student.dashboard');
      Route::get('/grade', 'grade')->name('student.grade');
      Route::get('/certificate', 'certificate')->name('student.certificate');
      Route::get('/certificate/export', 'exportCertificate')->name('student.certificate.export');
      Route::post('/logout', 'logout')->name('student.logout');
   });
});
