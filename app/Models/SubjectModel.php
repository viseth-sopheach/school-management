<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubjectModel extends Model
{
   protected $fillable = [
      'class_id',
      'subject_name',
   ];

   public function class()
   {
      return $this->belongsTo(ClassModel::class, 'class_id');
   }
}
