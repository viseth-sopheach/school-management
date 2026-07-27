import { useState } from "react";
import { exportCertificate } from "../../api/studentApi";
import { parseBlobError } from "../../utils/parseBlobError";
import { formatDate } from "../../utils/formatDate";

function CertificateSkeleton() {
  return (
    <div className="rounded-xl border-4 border-double border-[var(--color-text)]/30 bg-white/70 p-8 text-center dark:bg-black/20">
      <div className="mx-auto h-3 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="mx-auto mt-4 h-6 w-64 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="mx-auto mt-4 h-5 w-48 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="mx-auto mt-2 h-4 w-56 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="mx-auto mt-1 h-4 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
        <div className="w-full">
          <div className="h-3 w-16 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        </div>
        <div className="w-full">
          <div className="ml-auto h-3 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="ml-auto mt-2 h-4 w-28 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function CertificateCard({ certificate, loading, error }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const isApproved = certificate?.status === "approved";

  const handleExport = async () => {
    if (!isApproved) return; // user can export only if teacher approve

    setExportError("");
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
      setExportError(await parseBlobError(err));
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
        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            something went wrong
          </p>
        )}

        {loading ? (
          <CertificateSkeleton />
        ) : certificate ? (
          <>
            <div className="rounded-xl border-4 border-double border-[var(--color-text)]/30 bg-white/70 p-8 text-center dark:bg-black/20">
              <p className="text-xs tracking-[0.3em] uppercase opacity-60">
                {certificate.school_name}
              </p>
              <h3 className="mt-4 text-2xl font-bold">
                Certificate of Completion
              </h3>
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
                    {formatDate(certificate.completion_date) ||
                      "Pending approval"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {isApproved ? (
                <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                  Your certificate has been approved and ready to export.
                </p>
              ) : (
                <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                  Your certificate is awaiting teacher approval.
                </p>
              )}

              {exportError && (
                <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                  {exportError}
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
          </>
        ) : (
          !error && (
            <p className="text-sm opacity-70">No certificate available.</p>
          )
        )}
      </div>
    </div>
  );
}
