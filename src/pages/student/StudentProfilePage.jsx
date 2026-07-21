import { useEffect, useState } from "react";
import { getAccount, getMe } from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentProfilePage() {
  const [account, setAccount] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAccount(), getMe()])
      .then(([accountRes, meRes]) => {
        setAccount(accountRes.data.me);
        setStudentInfo(meRes.data.me);
      })
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
      <div className="rounded-2xl border border-black/10 bg-white/40 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 space-y-1">
        <p>
          <strong>Name:</strong> {account.name}
        </p>
        <p>
          <strong>Email:</strong> {account.email}
        </p>
        <p>
          <strong>Role:</strong> {account.role}
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Student Info</h2>
      {studentInfo ? (
        <div className="rounded-2xl border border-black/10 bg-white/40 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5 space-y-1">
          <p>
            <strong>Gender:</strong> {studentInfo.gender}
          </p>
          <p>
            <strong>DOB:</strong> {studentInfo.dob}
          </p>
          <p>
            <strong>C++ Score:</strong> {studentInfo.Cpp_score ?? "-"}
          </p>
          <p>
            <strong>C Score:</strong> {studentInfo.C_score ?? "-"}
          </p>
          <p>
            <strong>Grade:</strong> {studentInfo.grade ?? "-"}
          </p>
        </div>
      ) : (
        <p className="text-sm opacity-70">
          No student_info record is linked to your account yet.
        </p>
      )}
    </section>
  );
}
