import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClass,
  updateStudent,
  deleteStudent,
  approveCertificate,
} from "../../api/teacherApi";
import StudentTable from "../../components/teacher/StudentTable";
import LoadingTable from "../../components/common/LoadingTable";

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

  return (
    <section>
      <div className="rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {loading ? "Loading class..." : classData?.name}
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Manage students and certificate approvals for this class.
            </p>
          </div>

          {!loading && classData && (
            <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
              Total Students: {classData.students?.length ?? 0}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {actionError && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {actionError}
            </div>
          )}

          {loading ? (
            <LoadingTable rows={6} />
          ) : (
            !error && (
              <div className="overflow-x-auto">
                <StudentTable
                  students={classData?.students || []}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApproveCertificate={handleApproveCertificate}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}