<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ClassModel;
use App\Models\StudentInfoModel;

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

      $teacherOne = User::factory()->create([
         'name' => 'John',
         'email' => 'john@ms.com',
         'password' => '123',
         'role' => 'teacher',
      ]);

      $teacherTwo = User::factory()->create([
         'name' => 'Alex',
         'email' => 'sarah@ms.com',
         'password' => '123',
         'role' => 'teacher',
      ]);

      $classOne = ClassModel::create([
         'name' => 'C language',
         'teacher_id' => $teacherOne->id,
      ]);

      $classTwo = ClassModel::create([
         'name' => 'C++ language',
         'teacher_id' => $teacherTwo->id,
      ]);
      $studentOne = User::factory()->create([
         'name' => 'Tom',
         'email' => 'tom@ms.com',
         'password' => '123',
         'role' => 'student',
      ]);

      StudentInfoModel::create([
         'user_id' => $studentOne->id,
         'class_id' => $classOne->id,
         'name' => 'Tom',
         'gender' => 'Male',
         'dob' => '2005-05-15',
         'certificate_status' => 'pending',
         'academic_status' => 'active',
      ]);

      $studentTwo = User::factory()->create([
         'name' => 'Alice',
         'email' => 'alice@ms.com',
         'password' => '123',
         'role' => 'student',
      ]);

      StudentInfoModel::create([
         'user_id' => $studentTwo->id,
         'class_id' => $classOne->id,
         'name' => 'Alice',
         'gender' => 'Female',
         'dob' => '2005-08-22',
         'certificate_status' => 'pending',
         'academic_status' => 'active',
      ]);
   }
}
