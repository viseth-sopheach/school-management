import { useEffect, useState } from "react";
import { getAllClasses } from "../../api/adminApi";
import ClassTable from "../../components/admin/ClassTable";

function ClassesSkeleton({ rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Class Name</th>
              <th className="px-6 py-4 text-left font-semibold">Teacher</th>
              <th className="px-6 py-4 text-left font-semibold">Students</th>
              <th className="px-6 py-4 text-left font-semibold">Created</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="border-t border-black/10 dark:border-white/10"
              >
                <td className="px-6 py-4">
                  <div className="h-4 w-36 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllClasses()
      .then(({ data }) => {
        if (!isMounted) return;
        setClasses(data.classes ?? []);
        setError("");
      })
      .catch(() => {
        if (!isMounted) return;
        setError("something went wrong");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubjectsChange = (classId, subjects) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, subjects } : c)),
    );
  };

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

          {loading ? (
            <div className="h-9 w-36 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
          ) : (
            <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
              Total Classes: {classes.length}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              something went wrong
            </div>
          )}

          <div className="overflow-x-auto">
            {loading ? (
              <ClassesSkeleton rows={6} />
            ) : (
              !error && (
                <ClassTable
                  classes={classes}
                  onSubjectsChange={handleSubjectsChange}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
