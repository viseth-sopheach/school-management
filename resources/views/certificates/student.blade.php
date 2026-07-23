<!DOCTYPE html>
<html>
<head>
   <meta charset="utf-8">
   <title>Certificate of Completion</title>
   <style>
      @page {
         size: A4 landscape;
         margin: 0;
      }

      * {
         box-sizing: border-box;
      }

      body {
         margin: 0;
         padding: 12mm;
         font-family: "Georgia", "Times New Roman", serif;
         background-color: #fcfbf7;
         color: #111827;
         -webkit-print-color-adjust: exact;
      }

      .certificate-outer {
         border: 2px solid #b8860b;
         padding: 8px;
         height: 100%;
         position: relative;
      }

      .certificate-middle {
         border: 1px solid #1e293b;
         padding: 4px;
      }

      .certificate-inner {
         border: 2px solid #b8860b;
         padding: 40px 60px;
         text-align: center;
         position: relative;
         background-color: #ffffff;
      }

      /* Corner Ornament Accents */
      .corner {
         position: absolute;
         width: 24px;
         height: 24px;
         border-color: #b8860b;
         border-style: solid;
      }

      .corner-top-left {
         top: 12px;
         left: 12px;
         border-width: 3px 0 0 3px;
      }

      .corner-top-right {
         top: 12px;
         right: 12px;
         border-width: 3px 3px 0 0;
      }

      .corner-bottom-left {
         bottom: 12px;
         left: 12px;
         border-width: 0 0 3px 3px;
      }

      .corner-bottom-right {
         bottom: 12px;
         right: 12px;
         border-width: 0 3px 3px 0;
      }

      .school-name {
         font-size: 13pt;
         letter-spacing: 4px;
         text-transform: uppercase;
         color: #1e293b;
         font-weight: bold;
         margin: 0 0 15px 0;
      }

      .title {
         font-size: 34pt;
         font-family: "Times New Roman", serif;
         font-weight: normal;
         letter-spacing: 2px;
         color: #b8860b;
         text-transform: uppercase;
         margin: 10px 0 5px 0;
      }

      .divider {
         width: 120px;
         height: 2px;
         background-color: #b8860b;
         margin: 15px auto;
      }

      .intro {
         font-size: 11pt;
         font-style: italic;
         color: #475569;
         margin: 20px 0 10px 0;
      }

      .student-name {
         font-size: 28pt;
         font-weight: bold;
         color: #0f172a;
         margin: 10px 0;
         border-bottom: 1px solid #e2e8f0;
         display: inline-block;
         padding: 0 30px 5px 30px;
      }

      .description {
         font-size: 11pt;
         color: #334155;
         line-height: 1.6;
         margin: 20px auto 35px auto;
         max-width: 650px;
      }

      .class-name {
         font-size: 14pt;
         font-weight: bold;
         color: #0f172a;
         display: block;
         margin-top: 5px;
      }

      .footer {
         display: table;
         width: 100%;
         margin-top: 40px;
      }

      .footer-col {
         display: table-cell;
         width: 33.33%;
         vertical-align: bottom;
      }

      .footer-label {
         font-size: 9pt;
         text-transform: uppercase;
         letter-spacing: 1px;
         color: #64748b;
         margin-bottom: 6px;
      }

      .footer-value {
         font-size: 11pt;
         font-weight: bold;
         color: #1e293b;
         border-top: 1px solid #0f172a;
         padding-top: 6px;
         display: inline-block;
         width: 80%;
      }

      /* Gold Seal / Badge */
      .badge {
         width: 70px;
         height: 70px;
         background-color: #b8860b;
         border-radius: 50%;
         margin: 0 auto;
         color: #ffffff;
         line-height: 70px;
         font-size: 24pt;
         box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #b8860b;
      }
   </style>
</head>
<body>

<div class="certificate-outer">
   <div class="certificate-middle">
      <div class="certificate-inner">
         <!-- Corner Accents -->
         <div class="corner corner-top-left"></div>
         <div class="corner corner-top-right"></div>
         <div class="corner corner-bottom-left"></div>
         <div class="corner corner-bottom-right"></div>

         <p class="school-name">{{ $schoolName }}</p>

         <h1 class="title">Certificate of Completion</h1>
         <div class="divider"></div>

         <p class="intro">This is to certify that</p>

         <div class="student-name">{{ $studentName }}</div>

         <p class="description">
            has successfully fulfilled all requirements and demonstrated proficiency in
            <span class="class-name">{{ $className }}</span>
         </p>

         <div class="footer">
            <div class="footer-col" style="text-align: left;">
               <p class="footer-value">{{ $teacherName }}</p>
               <p class="footer-label">Instructor Signature</p>
            </div>

            <div class="footer-col" style="text-align: center;">
               <div class="badge">★</div>
            </div>

            <div class="footer-col" style="text-align: right;">
               <p class="footer-value">{{ $completionDate }}</p>
               <p class="footer-label">Date of Issuance</p>
            </div>
         </div>
      </div>
   </div>
</div>

</body>
</html>
