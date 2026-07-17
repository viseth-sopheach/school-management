<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
   /**
    * Run the migrations.
    */
   public function up(): void
   {
      Schema::create('student_info', function (Blueprint $table) {
         $table->id();
         $table->foreignId('class_id')->constrained()->cascadeOnDelete();
         $table->string('name');
         $table->enum('gender', ['Male', 'Female']);
         $table->date('dob');
         $table->float('C++_score')->nullable();
         $table->float('C_score')->nullable();
         $table->float('grade')->nullable();
         $table->timestamp('enrolled_at')->useCurrent();
      });
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::dropIfExists('student_info');
   }
};
