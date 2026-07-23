import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClass,
  updateStudent,
  deleteStudent,
  approveCertificate,
} from "../../api/teacherApi";
import StudentTable from "../../components/teacher/StudentTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ClassDetailPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadClass = async () => {
    try {
      const { data } = await getClass(classId);
      setClassData(data.class);
    } catch (err) {
      setError(
        "Failed to load class. This route may not exist on the backend yet.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClass();
  }, [classId]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Delete this student?")) return;
    await deleteStudent(studentId);
    setClassData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
    }));
  };

  const handleEdit = async (student) => {
    const name = window.prompt("New name", student.name);
    if (!name) return;
    await updateStudent(student.id, { name });
    setClassData((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === student.id ? { ...s, name } : s,
      ),
    }));
  };

  const handleApproveCertificate = async (studentId) => {
    setActionError("");

    try {
      await approveCertificate(studentId);
      setClassData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId ? { ...s, certificate_status: "approved" } : s,
        ),
      }));
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to approve certificate.",
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    );

  return (
    <section>
      <div className="rounded-2xl border border-black/10 bg-white/40 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          {classData?.name}
        </h1>

        {actionError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {actionError}
          </p>
        )}

        <div className="overflow-x-auto">
          <StudentTable
            students={classData?.students || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApproveCertificate={handleApproveCertificate}
          />
        </div>
      </div>
    </section>
  );
}
