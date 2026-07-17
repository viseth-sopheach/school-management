<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentInfoModel extends Model
{
   protected $fillable = [
      'class_id',
      'name',
      'gender',
      'dob',
      'Cpp_score',
      'C_score',
      'grade',
      'enrolled_at',
   ];
   protected $table = 'student_info';

   public function classes()
   {
      return $this->belongsTo(ClassModel::class, 'class_id');
   }
}
