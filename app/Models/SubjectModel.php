<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubjectModel extends Model
{
   protected $table = 'subjects';

   protected $fillable = [
      'class_id',
      'subject_name',
   ];

   public function class(): BelongsTo
   {
      return $this->belongsTo(ClassModel::class, 'class_id');
   }

   public function scores(): HasMany
   {
      return $this->hasMany(ScoreModel::class, 'subject_id');
   }
}
