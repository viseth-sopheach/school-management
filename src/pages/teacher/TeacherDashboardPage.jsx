import { useEffect, useState } from "react";
import { getMe, addStudent, addScore } from "../../api/teacherApi";
import AddStudentForm from "../../components/teacher/AddStudentForm";
import ScoreForm from "../../components/teacher/ScoreForm";
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
    <div className="page">
      <h1>Welcome, {teacher?.name}</h1>

      <AddStudentForm onAdd={addStudent} />
      <ScoreForm onSubmit={addScore} />

      <p className="hint">
        Class rosters aren't reachable yet — see ClassDetailPage notes for the
        missing route.
      </p>
    </div>
  );
}
