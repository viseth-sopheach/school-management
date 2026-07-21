import { useEffect, useState } from "react";
import { getAccount } from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentInfoPage() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  function formatDate(date) {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    getAccount()
      .then(({ data }) => setAccount(data.me))
      .catch(() => setError("Failed to load your account."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <p
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          color: "var(--color-text)",
          backgroundColor:
            "color-mix(in srgb, var(--color-text) 8%, transparent)",
          border:
            "1px solid color-mix(in srgb, var(--color-text) 20%, transparent)",
        }}
      >
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        My Account
      </h1>

      <div
        className="max-w-md rounded-2xl p-6 shadow-xl backdrop-blur-md"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-bg) 85%, var(--color-text) 15%)",
          border:
            "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
        }}
      >
        <dl
          className="divide-y"
          style={{
            borderColor:
              "color-mix(in srgb, var(--color-text) 15%, transparent)",
          }}
        >
          <InfoRow label="ID" value={account.id} />
          <InfoRow label="Name" value={account.name} />
          <InfoRow label="Email" value={account.email} />
          <InfoRow label="Role" value={account.role} capitalize />
          <InfoRow
            label="Email Verified"
            value={account.email_verified_at ? "Yes" : "No"}
          />
          <InfoRow label="Created At" value={formatDate(account.created_at)} />
          <InfoRow label="Updated At" value={formatDate(account.updated_at)} />
        </dl>
      </div>
    </section>
  );
}

function InfoRow({ label, value, capitalize = false }) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <dt className="text-sm font-medium opacity-60">{label}</dt>

      <dd className={`text-sm font-semibold ${capitalize ? "capitalize" : ""}`}>
        {value ?? "-"}
      </dd>
    </div>
  );
}
