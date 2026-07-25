import { useState } from "react";

function getScoreForSubject(student, subjectId) {
  return student.scores?.find((s) => s.subject_id === subjectId)?.score ?? "";
}

function formatDob(date) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function StudentTable({
  students,
  subjects,
  onEdit,
  onRemove,
  onApproveCertificate,
  onScoreChange,
  editingStudentId,
}) {
  const [pendingApproveStudent, setPendingApproveStudent] = useState(null);

  const showActionsColumn = Boolean(onEdit || onRemove);

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 py-12 text-center dark:border-white/20">
        <p className="text-lg font-medium opacity-70">
          No students in this class yet.
        </p>
      </div>
    );
  }

  const handleConfirmApprove = () => {
    if (pendingApproveStudent) {
      onApproveCertificate?.(pendingApproveStudent.id);
      setPendingApproveStudent(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Gender</th>
                <th className="px-6 py-4 text-left font-semibold">DOB</th>
                {subjects.map((subject) => (
                  <th
                    key={subject.id}
                    className="px-6 py-4 text-left font-semibold"
                  >
                    {subject.subject_name}
                  </th>
                ))}
                <th className="px-6 py-4 text-left font-semibold">Grade</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Certificate
                </th>
                {showActionsColumn && (
                  <th className="px-6 py-4 text-center font-semibold">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={`border-t border-black/10 transition-colors dark:border-white/10 ${
                    student.id === editingStudentId
                      ? "bg-black/5 dark:bg-white/10"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 opacity-80">{student.gender}</td>
                  <td className="px-6 py-4 opacity-80">
                    {formatDob(student.dob)}
                  </td>

                  {subjects.map((subject) => (
                    <td key={subject.id} className="px-6 py-4 opacity-80">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        defaultValue={getScoreForSubject(student, subject.id)}
                        disabled={!onScoreChange}
                        onBlur={(e) => {
                          if (!onScoreChange) return;
                          onScoreChange(student.id, subject.id, e.target.value);
                        }}
                        className="w-20 rounded-md border border-black/15 bg-transparent px-2 py-1 text-sm outline-none focus:border-black/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:focus:border-white/40"
                      />
                    </td>
                  ))}

                  <td className="px-6 py-4 opacity-80">
                    {student.grade != null
                      ? Number(student.grade).toFixed(1)
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {student.certificate_status === "approved" ? (
                      <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Approved
                      </span>
                    ) : onApproveCertificate ? (
                      <button
                        type="button"
                        onClick={() => setPendingApproveStudent(student)}
                        className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        Pending
                      </span>
                    )}
                  </td>

                  {showActionsColumn && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(student)}
                            className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                          >
                            Edit
                          </button>
                        )}
                        {onRemove && (
                          <button
                            onClick={() => onRemove(student.id)}
                            title="Removes the student from this class only; their account is kept"
                            className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-700"
                          >
                            Remove from Class
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingApproveStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-xl dark:border-white/10">
            <h3 className="text-lg font-semibold">Approve Certificate</h3>
            <p className="mt-2 text-sm opacity-70">
              Are you sure you want to approve the certificate for{" "}
              <span className="font-semibold">
                {pendingApproveStudent.name}
              </span>
              ? This action cannot be easily undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingApproveStudent(null)}
                className="rounded-lg border border-black/15 px-4 py-2 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
