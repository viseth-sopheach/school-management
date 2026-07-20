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
         'email' => 'viseth@example.com',
         'password' => '123',
         'role' => 'admin',
      ]);

      User::factory()->create([
         'name' => 'John',
         'email' => 'john@example.com',
         'password' => '123',
         'role' => 'teacher',
      ]);

      User::factory()->create([
         'name' => 'Tom',
         'email' => 'tom@example.com',
         'password' => '123',
         'role' => 'student',
      ]);
   }
}
