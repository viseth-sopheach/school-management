import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

export default function Update({ onCancel }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword) {
      setError("Please fill in both fields.");
      return;
    }

    setSubmitting(true);

    try {
      await updateProfile({ password: newPassword });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      navigate(`/${user.role}/me`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <form
        className="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style={{
          background:
            "color-mix(in srgb, var(--color-bg) 92%, var(--color-text) 8%)",
          border:
            "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
        }}
        onSubmit={handleSubmit}
      >
        <h2
          className="mb-6 text-2xl font-bold text-center"
          style={{ color: "var(--color-text)" }}
        >
          Change Password
        </h2>

        {error && (
          <p
            className="mb-4 rounded-lg px-3 py-2 text-sm"
            style={{
              background:
                "color-mix(in srgb, var(--color-text) 8%, transparent)",
              color: "var(--color-text)",
              border:
                "1px solid color-mix(in srgb, var(--color-text) 20%, transparent)",
            }}
          >
            something went wrong
          </p>
        )}

        {success && (
          <p
            className="mb-4 rounded-lg px-3 py-2 text-sm"
            style={{
              background:
                "color-mix(in srgb, var(--color-text) 8%, transparent)",
              color: "var(--color-text)",
              border:
                "1px solid color-mix(in srgb, var(--color-text) 20%, transparent)",
            }}
          >
            {success}
          </p>
        )}

        <div className="space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Current Password
            </label>

            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none transition focus:ring-2"
              style={{
                background:
                  "color-mix(in srgb, var(--color-bg) 85%, var(--color-text) 15%)",
                color: "var(--color-text)",
                border:
                  "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
              }}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none transition focus:ring-2"
              style={{
                background:
                  "color-mix(in srgb, var(--color-bg) 85%, var(--color-text) 15%)",
                color: "var(--color-text)",
                border:
                  "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3 font-semibold transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--color-text)",
              color: "var(--color-bg)",
            }}
          >
            {submitting ? "Updating..." : "Update Password"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl py-3 font-medium transition hover:opacity-80"
              style={{
                background: "transparent",
                color: "var(--color-text)",
                border:
                  "1px solid color-mix(in srgb, var(--color-text) 20%, transparent)",
              }}
            >
              Back to Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
