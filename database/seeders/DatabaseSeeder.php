<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
   use WithoutModelEvents;

   public function run(): void
   {
      User::factory()->create([
         'name' => 'Viseth',
         'email' => 'viseth@ms.com',
         'password' => '123',
         'role' => 'admin',
      ]);

      $teacher = User::factory()->create([
         'name' => 'John',
         'email' => 'john@ms.com',
         'password' => '123',
         'role' => 'teacher',
      ]);

      $class = \App\Models\ClassModel::create([
         'name' => 'C language',
         'teacher_id' => $teacher->id,
      ]);

      $studentUser = User::factory()->create([
         'name' => 'Tom',
         'email' => 'tom@ms.com',
         'password' => '123',
         'role' => 'student',
      ]);

      \App\Models\StudentInfoModel::create([
         'user_id' => $studentUser->id,
         'class_id' => $class->id,
         'name' => 'Tom',
         'gender' => 'Male',
         'dob' => '2005-05-15',
         'Cpp_score' => 85.0,
         'C_score' => 90.0,
         'grade' => 87.5,
         'certificate_status' => 'pending',
         'academic_status' => 'active',
      ]);
   }
}
