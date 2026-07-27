<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Services\GpaCalculatorService;

class StudentInfoModel extends Model
{
   protected $fillable = [
      'user_id',
      'class_id',
      'name',
      'gender',
      'dob',
      'Cpp_score',
      'C_score',
      'grade',
      'enrolled_at',
      'certificate_status',
      'certificate_approved_at',
      'certificate_approved_by',
      'academic_status',
   ];

   protected $table = 'student_info';

   public $timestamps = false;

   protected function casts(): array
   {
      return [
         'dob' => 'date',
         'enrolled_at' => 'datetime',
         'certificate_approved_at' => 'datetime',
      ];
   }

   public function classes(): BelongsTo
   {
      return $this->belongsTo(ClassModel::class, 'class_id');
   }

   public function user(): BelongsTo
   {
      return $this->belongsTo(User::class);
   }

   public function certificateApprover(): BelongsTo
   {
      return $this->belongsTo(User::class, 'certificate_approved_by');
   }

   public function scores(): HasMany
   {
      return $this->hasMany(ScoreModel::class, 'student_info_id');
   }

   public function gpaSummary(): array
   {
      $scores = $this->scores()
         ->whereNotNull('score')
         ->pluck('score')
         ->map(fn($score) => (float)$score)
         ->all();

      return app(GpaCalculatorService::class)->calculate($scores);
   }
}
