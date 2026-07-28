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

      html, body {
         width: 297mm;
         height: 210mm;
         margin: 0;
         padding: 0;
      }

      body {
         font-family: "Georgia", "Times New Roman", serif;
         background-color: #fcfbf7;
         color: #111827;
         -webkit-print-color-adjust: exact;
      }

      .page {
         width: 297mm;
         height: 210mm;
         padding: 10mm;
      }

      .certificate-outer {
         border: 1.5mm solid #b8860b;
         padding: 3mm;
         width: 100%;
         height: 100%;
         position: relative;
      }

      .certificate-middle {
         border: 0.5mm solid #1e293b;
         padding: 2mm;
         width: 100%;
         height: 100%;
      }

      .certificate-inner {
         border: 1.5mm solid #b8860b;
         width: 100%;
         height: 100%;
         padding: 14mm 20mm;
         text-align: center;
         position: relative;
         background-color: #ffffff;
      }

      .corner {
         position: absolute;
         width: 8mm;
         height: 8mm;
         border-color: #b8860b;
         border-style: solid;
      }

      .corner-top-left {
         top: 4mm;
         left: 4mm;
         border-width: 1mm 0 0 1mm;
      }

      .corner-top-right {
         top: 4mm;
         right: 4mm;
         border-width: 1mm 1mm 0 0;
      }

      .corner-bottom-left {
         bottom: 4mm;
         left: 4mm;
         border-width: 0 0 1mm 1mm;
      }

      .corner-bottom-right {
         bottom: 4mm;
         right: 4mm;
         border-width: 0 1mm 1mm 0;
      }

      .school-name {
         font-size: 13pt;
         letter-spacing: 1.5mm;
         text-transform: uppercase;
         color: #1e293b;
         font-weight: bold;
         margin: 0 0 5mm 0;
      }

      .title {
         font-size: 30pt;
         font-family: "Times New Roman", serif;
         font-weight: normal;
         letter-spacing: 0.7mm;
         color: #b8860b;
         text-transform: uppercase;
         margin: 3mm 0 2mm 0;
      }

      .divider {
         width: 40mm;
         height: 0.6mm;
         background-color: #b8860b;
         margin: 5mm auto;
      }

      .intro {
         font-size: 11pt;
         font-style: italic;
         color: #475569;
         margin: 6mm 0 3mm 0;
      }

      .student-name {
         font-size: 24pt;
         font-weight: bold;
         color: #0f172a;
         margin: 3mm 0;
         border-bottom: 0.3mm solid #e2e8f0;
         display: inline-block;
         padding: 0 10mm 1.5mm 10mm;
      }

      .description {
         font-size: 11pt;
         color: #334155;
         line-height: 1.6;
         margin: 6mm auto 10mm auto;
         max-width: 200mm;
      }

      .class-name {
         font-size: 13pt;
         font-weight: bold;
         color: #0f172a;
         display: block;
         margin-top: 1.5mm;
      }

      .footer {
         display: table;
         width: 100%;
         margin-top: 10mm;
      }

      .footer-col {
         display: table-cell;
         width: 33.33%;
         vertical-align: bottom;
      }

      .footer-label {
         font-size: 9pt;
         text-transform: uppercase;
         letter-spacing: 0.3mm;
         color: #64748b;
         margin-bottom: 1.5mm;
      }

      .footer-value {
         font-size: 11pt;
         font-weight: bold;
         color: #1e293b;
         border-top: 0.3mm solid #0f172a;
         padding-top: 1.5mm;
         display: inline-block;
         width: 80%;
      }

      .badge {
         width: 18mm;
         height: 18mm;
         background-color: #b8860b;
         border-radius: 50%;
         margin: 0 auto;
         color: #ffffff;
         line-height: 18mm;
         font-size: 20pt;
         box-shadow: 0 0 0 1mm #ffffff, 0 0 0 1.5mm #b8860b;
      }
   </style>
</head>
<body>

<div class="page">
   <div class="certificate-outer">
      <div class="certificate-middle">
         <div class="certificate-inner">
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
</div>

</body>
</html>
