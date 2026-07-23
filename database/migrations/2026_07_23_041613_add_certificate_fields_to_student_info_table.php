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
      Schema::table('student_info', function (Blueprint $table) {
         $table->enum('certificate_status', ['pending', 'approved'])->default('pending')->after('grade');

         $table->timestamp('certificate_approved_at')->nullable()->after('certificate_status');

         $table->foreignId('certificate_approved_by')->nullable()->after('certificate_approved_at')
            ->constrained('users')
            ->nullOnDelete();

         $table->enum('academic_status', ['active', 'inactive', 'graduated'])->default('active')->after('certificate_approved_by');
      });
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::table('student_info', function (Blueprint $table) {
         $table->dropForeign(['certificate_approved_by']);
         $table->dropColumn([
            'certificate_status',
            'certificate_approved_at',
            'certificate_approved_by',
            'academic_status',
         ]);
      });
   }
};
