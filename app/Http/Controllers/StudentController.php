<?php

namespace App\Http\Controllers;

use App\Models\StudentInfoModel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentController extends Controller
{
   private function getOrInitializeStudent(Request $request, array $with = [])
   {
      $userId = $request->user()->id;
      $student = StudentInfoModel::with($with)->where('user_id', $userId)->first();

      if (!$student) {
         try {
            $student = StudentInfoModel::create([
               'user_id' => $userId,
               'name' => $request->user()->name,
               'gender' => 'Male',
               'dob' => '2000-01-01',
               'academic_status' => 'active',
               'certificate_status' => 'pending',
            ]);
            if (!empty($with)) {
               $student->load($with);
            }
         } catch (\Exception $e) {
            $student = StudentInfoModel::with($with)->where('user_id', $userId)->first();
         }
      }

      return $student;
   }

   public function me(Request $request)
   {
      $student = $this->getOrInitializeStudent($request);
      return response()->json(['me' => $student]);
   }

   // Return the authenticated student's dashboard information.
   public function dashboard(Request $request)
   {
      $student = $this->getOrInitializeStudent($request, ['classes.teacher']);

      $academicStatus = $student->class_id
         ? ucfirst($student->academic_status ?? 'active')
         : 'Inactive';

      return response()->json([
         'student' => [
            'student_id' => $student->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'gender' => $student->gender,
            'class_name' => $student->classes?->name,
            'teacher_name' => $student->classes?->teacher?->name,
            'enrolled_at' => optional($student->enrolled_at)->toDateString(),
            'academic_status' => $academicStatus,
         ],
      ]);
   }

   public function grade(Request $request)
   {
      $student = $this->getOrInitializeStudent($request);
      return response()->json([
         'grade' => $student->gpaSummary(),
      ]);
   }

   public function certificate(Request $request)
   {
      $student = $this->getOrInitializeStudent($request, ['classes.teacher']);

      return response()->json([
         'certificate' => [
            'status' => $student->certificate_status,
            'student_name' => $request->user()->name,
            'class_name' => $student->classes?->name ?? 'N/A',
            'teacher_name' => $student->classes?->teacher?->name ?? 'N/A',
            'completion_date' => optional($student->certificate_approved_at)->toDateString(),
            'school_name' => config('app.name'),
         ],
      ]);
   }

   // Export the approved certificate as a PDF.
   public function exportCertificate(Request $request)
   {
      $student = $this->getOrInitializeStudent($request, ['classes.teacher']);

      if ($student->certificate_status !== 'approved') {
         return response()->json([
            'message' => 'Your certificate is awaiting teacher approval and cannot be exported yet.',
         ], 403);
      }

      $pdf = Pdf::loadView('certificates.student', [
         'studentName' => $request->user()->name,
         'className' => $student->classes?->name ?? 'N/A',
         'teacherName' => $student->classes?->teacher?->name ?? 'N/A',
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
