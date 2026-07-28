<?php

namespace App\Http\Controllers;

use App\Models\StudentInfoModel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentController extends Controller
{
   public function me(Request $request)
   {
      $student = StudentInfoModel::where('user_id', $request->user()->id)->first();
      return response()->json(['me' => $student]);
   }

   public function dashboard(Request $request)
   {
      $student = StudentInfoModel::with(['classes.teacher'])
         ->where('user_id', $request->user()->id)
         ->first();

      if (!$student) {
         $student = StudentInfoModel::create([
            'user_id' => $request->user()->id,
            'name' => $request->user()->name,
            'gender' => 'Male',
            'dob' => '2000-01-01',
            'academic_status' => 'active',
            'certificate_status' => 'pending',
         ]);
         $student->load(['classes.teacher']);
      }

      $enrolledClasses = $student->classes;

      $academicStatus = $enrolledClasses->isNotEmpty()
         ? ucfirst($student->academic_status ?? 'active')
         : 'Inactive';

      return response()->json([
         'student' => [
            'student_id' => $student->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'gender' => $student->gender,
            'class_name' => $enrolledClasses->isNotEmpty()
               ? $enrolledClasses->pluck('name')->implode(', ')
               : null,
            'teacher_name' => $enrolledClasses->isNotEmpty()
               ? $enrolledClasses->pluck('teacher.name')->filter()->unique()->implode(', ')
               : null,
            'enrolled_at' => optional($student->enrolled_at)->toDateString(),
            'academic_status' => $academicStatus,
         ],
      ]);
   }

   public function grade(Request $request)
   {
      $student = StudentInfoModel::where('user_id', $request->user()->id)->first();
      if (!$student) {
         $student = StudentInfoModel::create([
            'user_id' => $request->user()->id,
            'name' => $request->user()->name,
            'gender' => 'Male',
            'dob' => '2000-01-01',
            'academic_status' => 'active',
            'certificate_status' => 'pending',
         ]);
      }
      return response()->json([
         'grade' => $student->gpaSummary(),
      ]);
   }

   public function certificate(Request $request)
   {
      $student = StudentInfoModel::with(['classes.teacher'])
         ->where('user_id', $request->user()->id)
         ->first();

      if (!$student) {
         $student = StudentInfoModel::create([
            'user_id' => $request->user()->id,
            'name' => $request->user()->name,
            'gender' => 'Male',
            'dob' => '2000-01-01',
            'academic_status' => 'active',
            'certificate_status' => 'pending',
         ]);
         $student->load(['classes.teacher']);
      }

      // Certificates are issued per student, not per class. If a student
      // is enrolled in more than one class we show the first one here.
      $primaryClass = $student->classes->first();

      return response()->json([
         'certificate' => [
            'status' => $student->certificate_status,
            'student_name' => $request->user()->name,
            'class_name' => $primaryClass?->name ?? 'N/A',
            'teacher_name' => $primaryClass?->teacher?->name ?? 'N/A',
            'completion_date' => optional($student->certificate_approved_at)->toDateString(),
            'school_name' => config('app.name'),
         ],
      ]);
   }

   public function exportCertificate(Request $request)
   {
      $student = StudentInfoModel::with(['classes.teacher'])
         ->where('user_id', $request->user()->id)
         ->first();

      if (!$student) {
         $student = StudentInfoModel::create([
            'user_id' => $request->user()->id,
            'name' => $request->user()->name,
            'gender' => 'Male',
            'dob' => '2000-01-01',
            'academic_status' => 'active',
            'certificate_status' => 'pending',
         ]);
         $student->load(['classes.teacher']);
      }

      if ($student->certificate_status !== 'approved') {
         return response()->json([
            'message' => 'Your certificate is awaiting teacher approval and cannot be exported yet.',
         ], 403);
      }

      $primaryClass = $student->classes->first();

      $pdf = Pdf::loadView('certificates.student', [
         'studentName' => $request->user()->name,
         'className' => $primaryClass?->name ?? 'N/A',
         'teacherName' => $primaryClass?->teacher?->name ?? 'N/A',
         'completionDate' => optional($student->certificate_approved_at)->format('F j, Y'),
         'schoolName' => config('app.name'),
      ])->setPaper('a4', 'landscape');

      $fileName = 'certificate-' . Str::slug($request->user()->name) . '.pdf';

      return $pdf->download($fileName);
   }

   public function logout(Request $request)
   {
      $request->user()->currentAccessToken()->delete();
      return response()->json([
         'message' => 'Successfully logged out'
      ]);
   }
}
