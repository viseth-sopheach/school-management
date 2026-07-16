<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
   return $request->user();
})->middleware('auth:sanctum');

Route::prefix('me')->controller(AuthController::class)->group(function () {
   Route::get('/', 'index');
   Route::post('/register', 'register');
   Route::post('/login', 'login');
   Route::put('/update', 'update');
   Route::delete('/delete', 'delete');
});
