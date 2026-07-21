import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMe as getAdminMe } from "../api/adminApi";
import { getMe as getTeacherMe } from "../api/teacherApi";
import { getAccount as getStudentMe } from "../api/studentApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Update from "./Update";

const PROFILE_FETCHERS = {
  admin: getAdminMe,
  teacher: getTeacherMe,
  student: getStudentMe,
};

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const fetchMe = PROFILE_FETCHERS[user?.role];
    if (!fetchMe) {
      setError("Unknown user role.");
      setLoading(false);
      return;
    }

    fetchMe()
      .then(({ data }) => setAccount(data.me))
      .catch(() => setError("Failed to load your account."))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (showUpdate) {
    return <Update onCancel={() => setShowUpdate(false)} />;
  }

  return (
    <section className="mx-auto max-w-5xl px-6">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-black/[0.03] shadow-2xl dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-5 border-b border-black/10 p-8 dark:border-white/10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/10 text-3xl font-bold dark:bg-white/10">
            {account.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{account.name}</h2>
            <p className="opacity-70">{account.email}</p>
            <span className="mt-2 inline-block rounded-full bg-black/10 px-3 py-1 text-xs font-semibold capitalize dark:bg-white/10">
              {account.role}
            </span>
          </div>
        </div>

        <div className="grid gap-10 p-8 md:grid-cols-2">
          <div className="space-y-4">
            <InfoRow label="Full Name" value={account.name} />
            <InfoRow label="Email" value={account.email} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Created" value={formatDate(account.created_at)} />
            <InfoRow
              label="Last Updated"
              value={formatDate(account.updated_at)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-black/10 p-6 dark:border-white/10">
          <button
            onClick={() => setShowUpdate(true)}
            className="rounded-xl bg-[var(--color-text)] px-5 py-2.5 font-medium text-[var(--color-bg)] transition hover:opacity-90"
          >
            Update Password
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-black/[0.03] p-4 dark:bg-white/[0.03]">
      <span className="text-sm opacity-70">{label}</span>
      <span className="font-semibold">{value ?? "-"}</span>
    </div>
  );
}