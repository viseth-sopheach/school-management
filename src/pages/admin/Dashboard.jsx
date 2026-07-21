import { useEffect, useState } from "react";
import { getAllClasses } from "../../api/adminApi";
import ClassTable from "../../components/admin/ClassTable";
import LoadingTable from "../../components/common/LoadingTable";

export default function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllClasses()
      .then(({ data }) => setClasses(data.classes))
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Classes
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Overview of all academic classes.
            </p>
          </div>

          {!loading && (
            <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
              Total Classes: {classes.length}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingTable rows={6} />
          ) : (
            <div className="overflow-x-auto">
              <ClassTable classes={classes} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}