<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassModel extends Model
{
   protected $fillable = [
      'name',
      'created_at',
   ];

   protected $table = 'classes';
   public function students()
   {
      return $this->hasMany(StudentInfoModel::class, 'class_id');
   }
}
