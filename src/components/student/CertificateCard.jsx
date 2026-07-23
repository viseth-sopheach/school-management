import { useState } from "react";
import { exportCertificate } from "../../api/studentApi";
import { parseBlobError } from "../../utils/parseBlobError";

export default function CertificateCard({ certificate }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  if (!certificate) return null;

  const isApproved = certificate.status === "approved";

  const handleExport = async () => {
    // defense in depth, the button is already disabled unless approved
    if (!isApproved) return;

    setError("");
    setExporting(true);

    try {
      const response = await exportCertificate();
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(await parseBlobError(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-black/10 px-6 py-5 dark:border-white/10">
        <h2 className="text-xl font-semibold">Certificate</h2>
      </div>

      <div className="p-6">
        {/* Certificate preview */}
        <div className="rounded-xl border-4 border-double border-[var(--color-text)]/30 bg-white/70 p-8 text-center dark:bg-black/20">
          <p className="text-xs tracking-[0.3em] uppercase opacity-60">
            {certificate.school_name}
          </p>
          <h3 className="mt-4 text-2xl font-bold">Certificate of Completion</h3>
          {/* <p className="mt-4 text-sm opacity-70">This certifies that</p> */}
          <p className="mt-1 text-xl font-semibold">
            {certificate.student_name}
          </p>
          <p className="mt-2 text-sm opacity-70">
            has successfully completed the course
          </p>
          <p className="mt-1 font-medium">{certificate.class_name}</p>

          <div className="mt-6 flex flex-col justify-between gap-4 text-sm sm:flex-row">
            <div>
              <p className="opacity-60">Instructor</p>
              <p className="font-medium">{certificate.teacher_name}</p>
            </div>
            <div>
              <p className="opacity-60">Completion Date</p>
              <p className="font-medium">
                {certificate.completion_date || "Pending approval"}
              </p>
            </div>
          </div>
        </div>

        {/* Status + action */}
        <div className="mt-6">
          {isApproved ? (
            <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
              Your certificate has been approved and is ready to export.
            </p>
          ) : (
            <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
              Your certificate is awaiting teacher approval.
            </p>
          )}

          {error && (
            <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={!isApproved || exporting}
            className="rounded-md bg-[var(--color-text)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? "Preparing PDF..." : "Export as PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
