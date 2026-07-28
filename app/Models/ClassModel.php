<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassModel extends Model
{
   protected $fillable = [
      'name',
      'teacher_id',
      'created_at',
   ];

   protected $table = 'classes';

   /**
    * Students enrolled in this class. A student can be enrolled in
    * multiple classes, so this is a many-to-many relationship.
    */
   public function students(): BelongsToMany
   {
      return $this->belongsToMany(
         StudentInfoModel::class,
         'class_student',
         'class_id',
         'student_info_id'
      )->withTimestamps();
   }

   public function teacher(): BelongsTo
   {
      return $this->belongsTo(User::class, 'teacher_id');
   }

   public function subjects(): HasMany
   {
      return $this->hasMany(SubjectModel::class, 'class_id');
   }
}
