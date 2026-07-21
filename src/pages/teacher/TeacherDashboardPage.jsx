import { useEffect, useState } from "react";
import {
  getMe,
  getMyClasses,
  addScore,
  updateStudent,
  deleteStudent,
} from "../../api/teacherApi";
import ScoreForm from "../../components/teacher/ScoreForm";
import ManageStudentForm from "../../components/teacher/ManageStudentForm";
import MyClassesTable from "../../components/teacher/MyClassesTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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

        {classesError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {classesError}
          </div>
        )}

        {classesLoading ? (
          <p className="text-sm opacity-70">Loading your classes...</p>
        ) : (
          <MyClassesTable classes={classes} />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
          <ScoreForm onSubmit={addScore} />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
          <ManageStudentForm
            onUpdate={updateStudent}
            onDelete={deleteStudent}
          />
        </div>
      </div>
    </section>
  );
}
