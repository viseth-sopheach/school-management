import { useState } from "react";
import { createClass } from "../../api/adminApi";
import CreateClassForm from "../../components/admin/CreateClassForm";

export default function AdminClassesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createClass(data);
      setSuccess("Class created successfully!");
    } catch (err) {
      setError("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
          <div className="border-b border-black/10 px-6 py-5 dark:border-white/10">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Classes
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Create and manage new academic classes.
            </p>
          </div>

          <div className="p-6">
            {/* Error Notification */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                {success}
              </div>
            )}

            <CreateClassForm onCreate={handleCreate} isLoading={loading} />

            <div className="mt-8 rounded-xl border border-black/5 bg-black/5 p-4 text-sm opacity-70 dark:border-white/5 dark:bg-white/5">
              <p>
                <strong>Note:</strong> A list of existing classes isn't
                available yet — the API currently has no GET endpoint for
                classes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
