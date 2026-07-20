import { useEffect, useState } from "react";
import {
  getMe,
  addStudent,
  addScore,
  updateStudent,
  deleteStudent,
} from "../../api/teacherApi";
import AddStudentForm from "../../components/teacher/AddStudentForm";
import ScoreForm from "../../components/teacher/ScoreForm";
import ManageStudentForm from "../../components/teacher/ManageStudentForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(({ data }) => setTeacher(data.me))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Welcome, {teacher?.name}
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
          <AddStudentForm onAdd={addStudent} />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
          <ScoreForm onSubmit={addScore} />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 md:col-span-2 dark:border-white/10 dark:bg-white/5">
          <ManageStudentForm
            onUpdate={updateStudent}
            onDelete={deleteStudent}
          />
        </div>
      </div>

      <p className="text-sm opacity-70">
        A class roster view isn't available yet — the{" "}
        <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">
          teacher.dashboard
        </code>{" "}
        route (
        <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">
          GET /teacher/
        </code>
        ) expects a class ID that the route doesn't currently provide, so it
        can't be called from here yet.
      </p>
    </section>
  );
}
