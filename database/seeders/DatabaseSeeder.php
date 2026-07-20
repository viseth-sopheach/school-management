<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
   use WithoutModelEvents;

   /**
    * Seed the application's database.
    */
   public function run(): void
   {
      User::factory()->create([
         'name' => 'Viseth',
         'email' => 'viseth@example.com',
         'password' => Hash::make('123'),
         'role' => 'admin',
      ]);

      User::factory()->create([
         'name' => 'John',
         'email' => 'john@example.com',
         'password' => Hash::make('123'),
         'role' => 'teacher',
      ]);

      User::factory()->create([
         'name' => 'Tom',
         'email' => 'tom@example.com',
         'password' => Hash::make('123'),
         'role' => 'student',
      ]);
   }
}
