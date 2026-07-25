<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScoreModel extends Model
{
   protected $table = 'scores';

   protected $fillable = [
      'student_info_id',
      'subject_id',
      'score',
   ];

   public function student(): BelongsTo
   {
      return $this->belongsTo(StudentInfoModel::class, 'student_info_id');
   }

   public function subject(): BelongsTo
   {
      return $this->belongsTo(SubjectModel::class, 'subject_id');
   }
}
