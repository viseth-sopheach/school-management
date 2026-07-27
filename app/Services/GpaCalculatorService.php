<?php

namespace App\Services;

class GpaCalculatorService
{
   private const GRADING_TABLE = [
      ['min' => 90, 'gpa' => 4.0, 'letter' => 'A'],
      ['min' => 85, 'gpa' => 3.7, 'letter' => 'A-'],
      ['min' => 80, 'gpa' => 3.5, 'letter' => 'B+'],
      ['min' => 75, 'gpa' => 3.0, 'letter' => 'B'],
      ['min' => 70, 'gpa' => 2.5, 'letter' => 'C+'],
      ['min' => 65, 'gpa' => 2.0, 'letter' => 'C'],
      ['min' => 60, 'gpa' => 1.5, 'letter' => 'D+'],
      ['min' => 50, 'gpa' => 1.0, 'letter' => 'D'],
      ['min' => 0, 'gpa' => 0.0, 'letter' => 'F'],
   ];
   public function calculate(array $scores): array
   {
      $subjectCount = count($scores);
      if ($subjectCount === 0) {
         return [
            'subject_count' => 0,
            'average_score' => 0.0,
            'gpa' => 0.0,
            'letter_grade' => null,
         ];
      }
      $averageScore = round(array_sum($scores) / $subjectCount, 2);
      $band = $this->bandFor($averageScore);
      return [
         'subject_count' => $subjectCount,
         'average_score' => $averageScore,
         'gpa' => $band['gpa'],
         'letter_grade' => $band['letter'],
      ];
   }

   // return array
   private function bandFor(float $averageScore): array
   {
      foreach (self::GRADING_TABLE as $band) {
         if ($averageScore >= $band['min']) {
            return $band;
         }
      }

      return ['min' => 0, 'gpa' => 0.0, 'letter' => 'F'];
   }
}
