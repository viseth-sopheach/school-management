import { useEffect, useState } from "react";
import { getDashboard, getCertificate } from "../../api/studentApi";
import StudentInfoCard from "../../components/student/StudentInfoCard";
import CertificateCard from "../../components/student/CertificateCard";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [studentError, setStudentError] = useState("");

  const [certificate, setCertificate] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(true);
  const [certificateError, setCertificateError] = useState("");

  // Fetch each section independently so one slow/failed request
  // doesn't block the rest of the page from rendering.
  useEffect(() => {
    let isMounted = true;

    getDashboard()
      .then(({ data }) => {
        if (!isMounted) return;
        setStudent(data.student);
      })
      .catch((err) => {
        if (!isMounted) return;
        setStudentError(
          err.response?.data?.message ||
            "Failed to load your information. Please try again later.",
        );
      })
      .finally(() => {
        if (isMounted) setStudentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    getCertificate()
      .then(({ data }) => {
        if (!isMounted) return;
        setCertificate(data.certificate);
      })
      .catch((err) => {
        if (!isMounted) return;
        setCertificateError(
          err.response?.data?.message ||
            "Failed to load your certificate. Please try again later.",
        );
      })
      .finally(() => {
        if (isMounted) setCertificateLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        My Dashboard
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentInfoCard
          student={student}
          loading={studentLoading}
          error={studentError}
        />
        <CertificateCard
          certificate={certificate}
          loading={certificateLoading}
          error={certificateError}
        />
      </div>
    </section>
  );
}
