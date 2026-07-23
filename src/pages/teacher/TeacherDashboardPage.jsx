import { useEffect, useState } from "react";
import { getMe, getMyClasses } from "../../api/teacherApi";
import MyClassesTable from "../../components/teacher/MyClassesTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import LoadingTable from "../../components/common/LoadingTable";

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState("");

  useEffect(() => {
    getMe()
      .then(({ data }) => setTeacher(data.me))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getMyClasses()
      .then(({ data }) => setClasses(data.classes))
      .catch(() => setClassesError("Failed to load your classes."))
      .finally(() => setClassesLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Welcome, {teacher?.name}
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
          <LoadingTable rows={4} />
        ) : (
          <MyClassesTable classes={classes} />
        )}
      </div>
    </section>
  );
}
