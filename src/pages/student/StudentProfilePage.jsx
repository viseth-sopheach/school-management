// src/pages/student/StudentProfilePage.jsx
import { useEffect, useState } from "react";
import { getAccount } from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentProfilePage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAccount()
      .then(({ data }) => setStudent(data.me))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="max-w-md">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
        My Account
      </h1>
      <div className="rounded-2xl border border-black/10 bg-white/40 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <p>
          <strong>Name:</strong> {student.name}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Role:</strong> {student.role}
        </p>
      </div>
    </section>
  );
}
