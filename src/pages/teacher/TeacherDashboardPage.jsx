import { useEffect, useState } from "react";
import { getMe, getMyClasses } from "../../api/teacherApi";
import MyClassesTable from "../../components/teacher/MyClassesTable";

function MyClassesSkeleton({ rows = 4 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Class Name</th>
              <th className="px-6 py-4 text-left font-semibold">Students</th>
              <th className="px-6 py-4 text-left font-semibold">Created</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="border-t border-black/10 dark:border-white/10"
              >
                <td className="px-6 py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="mx-auto h-9 w-24 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(true);

  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState("");

  useEffect(() => {
    getMe()
      .then(({ data }) => setTeacher(data.me))
      .finally(() => setTeacherLoading(false));
  }, []);

  useEffect(() => {
    getMyClasses()
      .then(({ data }) => setClasses(data.classes))
      .catch(() => setClassesError("Failed to load your classes."))
      .finally(() => setClassesLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {teacherLoading ? (
          <span className="inline-block h-7 w-56 animate-pulse rounded bg-black/10 align-middle dark:bg-white/10" />
        ) : (
          `Welcome, ${teacher?.name}`
        )}
      </h1>

      <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-semibold">My Classes</h2>
        <p className="mb-4 text-sm opacity-70">
          Open a class to add students, edit their info, and manage scores.
        </p>

        {classesError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {classesError}
          </div>
        )}

        {classesLoading ? (
          <MyClassesSkeleton rows={4} />
        ) : (
          <MyClassesTable classes={classes} />
        )}
      </div>
    </section>
  );
}
