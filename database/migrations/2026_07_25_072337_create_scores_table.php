<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
   public function up(): void
   {
      Schema::create('scores', function (Blueprint $table) {
         $table->id();
         $table->foreignId('student_info_id')->constrained('student_info')->cascadeOnDelete();
         $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
         $table->float('score')->nullable();
         $table->timestamps();

         $table->unique(['student_info_id', 'subject_id']);
      });
   }

   public function down(): void
   {
      Schema::dropIfExists('scores');
   }
};
