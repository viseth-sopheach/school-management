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
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        My Dashboard
      </h1>
      <div className="max-w-sm">
        <GradeCard grade={grade} />
      </div>
    </section>
  );
}
