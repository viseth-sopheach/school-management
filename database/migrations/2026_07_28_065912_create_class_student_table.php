<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
   public function up(): void
   {
      Schema::create('class_student', function (Blueprint $table) {
         $table->id();

         $table->foreignId('class_id')
            ->constrained('classes')
            ->cascadeOnDelete();

         $table->foreignId('student_info_id')
            ->constrained('student_info')
            ->cascadeOnDelete();

         $table->timestamps();

         // A student can only be enrolled once per class.
         $table->unique(['class_id', 'student_info_id']);
      });
   }

   public function down(): void
   {
      Schema::dropIfExists('class_student');
   }
};
