<!DOCTYPE html>
<html>
<head>
   <meta charset="utf-8">
   <title>Certificate of Completion</title>
   <style>
      @page {
         margin: 0;
      }

      body {
         font-family: 'Helvetica', 'Arial', sans-serif;
         margin: 0;
         padding: 60px;
         color: #1b1b18;
      }

      .certificate {
         border: 10px solid #1b1b18;
         padding: 50px;
         text-align: center;
      }

      .certificate-inner {
         border: 2px solid #1b1b18;
         padding: 40px;
      }

      .school-name {
         font-size: 14px;
         letter-spacing: 4px;
         text-transform: uppercase;
         color: #706f6c;
      }

      .title {
         font-size: 34px;
         font-weight: bold;
         margin: 20px 0;
      }

      .intro {
         font-size: 14px;
         color: #706f6c;
      }

      .student-name {
         font-size: 28px;
         font-weight: bold;
         margin: 10px 0 20px;
      }

      .description {
         font-size: 14px;
         margin-bottom: 30px;
      }

      .class-name {
         font-weight: bold;
      }

      .footer {
         display: table;
         width: 100%;
         margin-top: 60px;
      }

      .footer-col {
         display: table-cell;
         width: 50%;
         font-size: 12px;
      }

      .footer-label {
         color: #706f6c;
         margin-bottom: 4px;
      }

      .footer-value {
         font-weight: bold;
         border-top: 1px solid #1b1b18;
         padding-top: 6px;
         display: inline-block;
         min-width: 200px;
      }
   </style>
</head>
<body>
<div class="certificate">
   <div class="certificate-inner">
      <p class="school-name">{{ $schoolName }}</p>
      <p class="title">Certificate of Completion</p>
      <p class="intro">This certificate is proudly presented to</p>
      <p class="student-name">{{ $studentName }}</p>
      <p class="description">
         for successfully completing the course
         <span class="class-name">{{ $className }}</span>
      </p>

      <div class="footer">
         <div class="footer-col">
            <p class="footer-label">Instructor</p>
            <p class="footer-value">{{ $teacherName }}</p>
         </div>
         <div class="footer-col" style="text-align: right;">
            <p class="footer-label">Date of Completion</p>
            <p class="footer-value">{{ $completionDate }}</p>
         </div>
      </div>
   </div>
</div>
</body>
</html>
