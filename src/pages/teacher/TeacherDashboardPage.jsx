import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, getMyClasses } from "../../api/teacherApi";

function StatCard({ label, value, loading }) {
  return (
    <div className="rounded-lg bg-black/[0.03] p-4 dark:bg-white/[0.03]">
      <p className="text-sm opacity-70">{label}</p>
      {loading ? (
        <div className="mt-2 h-7 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      ) : (
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      )}
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
      .catch(() => setClassesError("something went wrong"))
      .finally(() => setClassesLoading(false));
  }, []);

  const totalStudents = classes.reduce(
    (sum, c) => sum + (c.students_count ?? 0),
    0,
  );
  const uniqueSubjectNames = new Set(
    classes.flatMap((c) =>
      (c.subjects ?? []).map((s) => s.subject_name.trim().toLowerCase()),
    ),
  );
  const totalSubjects = uniqueSubjectNames.size;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {teacherLoading ? (
          <span className="inline-block h-7 w-56 animate-pulse rounded bg-black/10 align-middle dark:bg-white/10" />
        ) : (
          `Welcome, ${teacher?.name}`
        )}
      </h1>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Classes"
          value={classes.length}
          loading={classesLoading}
        />
        <StatCard
          label="Students"
          value={totalStudents}
          loading={classesLoading}
        />
        <StatCard
          label="Subjects"
          value={totalSubjects}
          loading={classesLoading}
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Classes</h2>
          <Link
            to="/teacher/classes"
            className="text-sm font-medium underline underline-offset-2 opacity-80 hover:opacity-100"
          >
            View all
          </Link>
        </div>

        {classesError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {classesError}
          </div>
        )}

        {classesLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-black/5 dark:bg-white/5"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <p className="py-6 text-center text-sm opacity-70">
            You haven't been assigned to any classes yet.
          </p>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {classes.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to={`/teacher/classes/${c.id}`}
                className="flex items-center justify-between py-3 transition hover:opacity-70"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs opacity-60">
                    {c.students_count} students · {c.subjects?.length ?? 0}{" "}
                    subjects
                  </p>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
