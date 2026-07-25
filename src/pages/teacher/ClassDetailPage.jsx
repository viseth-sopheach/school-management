import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getClass as getTeacherClass,
  updateStudent as updateStudentAsTeacher,
  addStudent,
  approveCertificate,
  removeStudentFromClass as removeStudentFromClassAsTeacher,
  attachStudent,
} from "../../api/teacherApi";
import {
  getClass as getAdminClass,
  updateStudent as updateStudentAsAdmin,
  removeStudentFromClass as removeStudentFromClassAsAdmin,
  updateStudentScore,
} from "../../api/adminApi";
import StudentTable from "../../components/teacher/StudentTable";
import AddStudentForm from "../../components/teacher/AddStudentForm";
import EditStudentForm from "../../components/teacher/EditStudentForm";
import AttachStudentForm from "../../components/teacher/AttachStudentForm";

export default function ClassDetailPage() {
  const { classId } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const navBack = useNavigate();

  useEffect(() => {
    loadClass();
    // eslint disable next line react hooks/exhaustive deps
  }, [classId]);

  const loadClass = async () => {
    setLoading(true);
    setError("");

    try {
      const fetchClass = isAdmin ? getAdminClass : getTeacherClass;
      const { data } = await fetchClass(classId);
      setClassData(data.class);
    } catch (err) {
      setError(
        err.response?.data?.message ||
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
      const removeFn = isAdmin
        ? removeStudentFromClassAsAdmin
        : removeStudentFromClassAsTeacher;
      await removeFn(classId, studentId);
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
      const updateFn = isAdmin ? updateStudentAsAdmin : updateStudentAsTeacher;
      const { data } = await updateFn(studentId, formValues);
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

  const handleScoreChange = async (studentId, subjectId, value) => {
    setActionError("");
    try {
      const { data } = isAdmin
        ? await updateStudentScore(studentId, { [subjectId]: value })
        : await updateStudentAsTeacher(studentId, {
            scores: { [subjectId]: value },
          });

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
              {classData?.name ?? "Class"}
            </h1>
            <p className="mt-1 text-sm opacity-70">
              {isAdmin
                ? "Viewing class details."
                : "Manage students, scores, and certificate approvals."}
            </p>
          </div>

          {classData && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
                <button onClick={() => navBack(-1)}>Back to dashboard</button>
              </div>
              <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
                Total Students: {classData.students?.length ?? 0}
              </div>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAddOptions((prev) => !prev)}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 dark:bg-white dark:text-black"
                >
                  {showAddOptions ? "Close Form" : "+ Add Student"}
                </button>
              )}
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
            <p className="py-12 text-center text-sm opacity-70">Loading...</p>
          ) : (
            !error && (
              <>
                {!isAdmin && showAddOptions && (
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
                      subjects={classData?.subjects || []}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingStudent(null)}
                    />
                  </div>
                )}

                <div className="overflow-x-auto">
                  <StudentTable
                    students={classData?.students || []}
                    subjects={classData?.subjects || []}
                    onEdit={(student) => setEditingStudent(student)}
                    onRemove={handleRemoveFromClass}
                    onApproveCertificate={
                      isAdmin ? undefined : handleApproveCertificate
                    }
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
