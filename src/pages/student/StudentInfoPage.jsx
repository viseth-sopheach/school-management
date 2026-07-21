import { useEffect, useState } from "react";
import { getMe } from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentInfoPage() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(({ data }) => setInfo(data.me))
      .catch(() => setError("Failed to load your info."))
      .finally(() => setLoading(false));
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
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Info</h1>

      <div className="max-w-md rounded-2xl border border-black/10 bg-white/40 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <dl className="divide-y divide-black/10 dark:divide-white/10">
          <InfoRow label="Name" value={info.name} />
          <InfoRow label="Gender" value={info.gender} />
          <InfoRow label="Date of Birth" value={info.dob} />
          <InfoRow
            label="C++ Score"
            value={info.Cpp_score ?? "Not graded yet"}
          />
          <InfoRow label="C Score" value={info.C_score ?? "Not graded yet"} />
          <InfoRow label="Grade" value={info.grade ?? "Not graded yet"} />
        </dl>
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <dt className="text-sm font-medium opacity-70">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}
