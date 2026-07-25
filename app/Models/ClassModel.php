<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassModel extends Model
{
   protected $fillable = [
      'name',
      'teacher_id',
      'created_at',
   ];

   protected $table = 'classes';
   public function students() : HasMany
   {
      return $this->hasMany(StudentInfoModel::class, 'class_id');
   }
   public function teacher() : BelongsTo
   {
      return $this->belongsTo(User::class, 'teacher_id');
   }

   public function subjects() : HasMany
   {
      return $this->hasMany(SubjectModel::class, 'class_id');
   }
}
