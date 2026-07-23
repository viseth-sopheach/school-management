import { useEffect, useState } from "react";
import { getDashboard, getCertificate } from "../../api/studentApi";
import StudentInfoCard from "../../components/student/StudentInfoCard";
import CertificateCard from "../../components/student/CertificateCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getDashboard(), getCertificate()])
      .then(([dashboardRes, certificateRes]) => {
        if (!isMounted) return;
        setStudent(dashboardRes.data.student);
        setCertificate(certificateRes.data.certificate);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err.response?.data?.message ||
            "Failed to load your dashboard. Please try again later.",
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        My Dashboard
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentInfoCard student={student} />
        <CertificateCard certificate={certificate} />
      </div>
    </section>
  );
}
