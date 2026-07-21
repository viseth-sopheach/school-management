import { useEffect, useState } from "react";
import { getMe } from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Update from "../Update";

export default function TeacherProfilePage() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);

  function formatDate(date) {
    if (!date) return "-";

    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}/${d.getFullYear()}`;
  }

  useEffect(() => {
    getMe()
      .then(({ data }) => setAccount(data.me))
      .catch(() => setError("Failed to load your account."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-lg">
        <div
          className="rounded-xl p-4"
          style={{
            background: "color-mix(in srgb, var(--color-text) 8%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--color-text) 20%, transparent)",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (showUpdate) {
    return <Update onCancel={() => setShowUpdate(false)} />;
  }

  return (
    <section className="mx-auto max-w-5xl px-6">
      <h1
        className="mb-8 text-3xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        My Account
      </h1>

      <div
        className="overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background:
            "color-mix(in srgb, var(--color-bg) 92%, var(--color-text) 8%)",
          border:
            "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-5 p-8"
          style={{
            background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
            borderBottom:
              "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
          }}
        >
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold"
            style={{
              background:
                "color-mix(in srgb, var(--color-text) 15%, transparent)",
              color: "var(--color-text)",
            }}
          >
            {account.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              {account.name}
            </h2>

            <p className="opacity-70">{account.email}</p>

            <span
              className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize"
              style={{
                background:
                  "color-mix(in srgb, var(--color-text) 10%, transparent)",
              }}
            >
              {account.role}
            </span>
          </div>
        </div>

        {/* Body */}
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

        {/* Footer */}
        <div
          className="flex justify-end gap-4 p-6"
          style={{
            borderTop:
              "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
          }}
        >
          <button
            onClick={() => setShowUpdate(true)}
            className="rounded-xl px-5 py-2.5 font-medium transition hover:opacity-90"
            style={{
              background: "var(--color-text)",
              color: "var(--color-bg)",
            }}
          >
            Update Password
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value, capitalize = false }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl p-4"
      style={{
        background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
      }}
    >
      <span className="text-sm opacity-70">{label}</span>

      <span
        className={`font-semibold ${capitalize ? "capitalize" : ""}`}
        style={{ color: "var(--color-text)" }}
      >
        {value ?? "-"}
      </span>
    </div>
  );
}
