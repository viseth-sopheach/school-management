import { useEffect, useState } from "react";
import { getGrade } from "../../api/studentApi";
import GradeCard from "../../components/student/GradeCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentDashboardPage() {
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGrade()
      .then(({ data }) => setGrade(data.grade))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <h1>My Dashboard</h1>
      <GradeCard grade={grade} />
    </div>
  );
}
