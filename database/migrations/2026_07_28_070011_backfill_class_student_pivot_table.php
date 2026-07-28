<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
   /**
    * Copy every existing student_info.class_id value into the new
    * class_student pivot table so no enrollment data is lost.
    */
   public function up(): void
   {
      DB::table('student_info')
         ->whereNotNull('class_id')
         ->select('id', 'class_id') // no alias here — chunkById needs the real column name
         ->orderBy('id')
         ->chunkById(200, function ($rows) {
            $now = now();

            $pivotRows = $rows->map(fn ($row) => [
               'class_id' => $row->class_id,
               'student_info_id' => $row->id, // map after fetching, not in SQL
               'created_at' => $now,
               'updated_at' => $now,
            ])->all();

            if (!empty($pivotRows)) {
               // insertOrIgnore guards against re-running this
               // migration and hitting the unique constraint.
               DB::table('class_student')->insertOrIgnore($pivotRows);
            }
         }, 'id'); // chunk by the actual "id" column, not the alias
   }

   public function down(): void
   {
      // This is a data migration; reversing it precisely isn't
      // meaningful once class_id has been dropped. We simply clear
      // the pivot table so the schema rollback (below) starts clean.
      DB::table('class_student')->truncate();
   }
};
