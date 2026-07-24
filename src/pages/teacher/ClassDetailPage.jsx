import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClass,
  updateStudent,
  addStudent,
  approveCertificate,
  removeStudentFromClass,
  attachStudent,
} from "../../api/teacherApi";
import StudentTable from "../../components/teacher/StudentTable";
import AddStudentForm from "../../components/teacher/AddStudentForm";
import EditStudentForm from "../../components/teacher/EditStudentForm";
import AttachStudentForm from "../../components/teacher/AttachStudentForm";

function StudentTableSkeleton({ rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Gender</th>
              <th className="px-6 py-4 text-left font-semibold">DOB</th>
              <th className="px-6 py-4 text-left font-semibold">C++ Score</th>
              <th className="px-6 py-4 text-left font-semibold">C Score</th>
              <th className="px-6 py-4 text-left font-semibold">Grade</th>
              <th className="px-6 py-4 text-left font-semibold">Certificate</th>
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
                  <div className="h-4 w-28 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-14 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="mx-auto flex w-fit gap-2">
                    <div className="h-8 w-14 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
                    <div className="h-8 w-28 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ClassDetailPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const navBack = useNavigate();

  useEffect(() => {
    loadClass();
  }, [classId]);

  const loadClass = async () => {
    setLoading(true);
    setError("");

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

  const handleAttachStudent = async (studentId) => {
    try {
      const { data } = await attachStudent(classId, studentId);

      setClassData((prev) => ({
        ...prev,
        students: [...(prev.students || []), data.student],
      }));
      setShowAddOptions(false);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to attach student to class.",
      );
    }
  };

  const handleAddStudent = async (formValues) => {
    try {
      const { data } = await addStudent(formValues);

      setClassData((prev) => ({
        ...prev,
        students: [...(prev.students || []), data.student],
      }));
      setShowAddOptions(false);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to add student.");
    }
  };

  const handleRemoveFromClass = async (studentId) => {
    if (
      !window.confirm(
        "Remove this student from the class? Their account and records will not be deleted.",
      )
    ) {
      return;
    }

    setActionError("");

    try {
      await removeStudentFromClass(classId, studentId);
      setClassData((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== studentId),
      }));
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to remove student from class.",
      );
    }
  };

  const handleSaveEdit = async (studentId, formValues) => {
    try {
      const { data } = await updateStudent(studentId, formValues);

      setClassData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === studentId ? { ...s, ...data.student } : s,
        ),
      }));
      setEditingStudent(null);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Failed to update student details.",
      );
    }
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

  const handleScoreChange = async (studentId, field, value) => {
    setActionError("");
    try {
      const { data } = await updateStudent(studentId, { [field]: value });
      const updated = data["student updated"];
      setClassData((prev) => ({
        ...prev,
        students: prev.students.map((s) => (s.id === studentId ? updated : s)),
      }));
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update score.");
    }
  };

  return (
    <section>
      <div className="rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {loading ? (
                <span className="inline-block h-8 w-48 animate-pulse rounded bg-black/10 align-middle dark:bg-white/10" />
              ) : (
                classData?.name
              )}
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Manage students, scores, and certificate approvals.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-3">
              <div className="h-9 w-36 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
              <div className="h-9 w-32 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
              <div className="h-9 w-28 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
            </div>
          ) : (
            classData && (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
                  <button onClick={() => navBack(-1)}>Back to dashboard</button>
                </div>
                <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
                  Total Students: {classData.students?.length ?? 0}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddOptions((prev) => !prev)}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 dark:bg-white dark:text-black"
                >
                  {showAddOptions ? "Close Form" : "+ Add Student"}
                </button>
              </div>
            )
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
            <StudentTableSkeleton rows={6} />
          ) : (
            !error && (
              <>
                {showAddOptions && (
                  <div className="mb-6 space-y-6">
                    <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
                      <AddStudentForm
                        classId={classId}
                        onAdd={handleAddStudent}
                      />
                    </div>
                    <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
                      <h3 className="mb-3 text-lg font-semibold">
                        Add Existing Student
                      </h3>
                      <AttachStudentForm onAttach={handleAttachStudent} />
                    </div>
                  </div>
                )}

                {editingStudent && (
                  <div className="mb-6">
                    <EditStudentForm
                      student={editingStudent}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingStudent(null)}
                    />
                  </div>
                )}

                <div className="overflow-x-auto">
                  <StudentTable
                    students={classData?.students || []}
                    onEdit={(student) => setEditingStudent(student)}
                    onRemove={handleRemoveFromClass}
                    onApproveCertificate={handleApproveCertificate}
                    onScoreChange={handleScoreChange}
                    editingStudentId={editingStudent?.id}
                  />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
}
