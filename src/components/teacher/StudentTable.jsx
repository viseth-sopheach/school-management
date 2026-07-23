export default function StudentTable({
  students,
  onEdit,
  onRemove,
  onApproveCertificate,
}) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 dark:border-white/20 py-12 text-center">
        <p className="text-lg font-medium opacity-70">
          No students in this class yet.
        </p>
      </div>
    );
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
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-t border-black/10 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {student.name}
                </td>
                <td className="px-6 py-4 opacity-80">{student.gender}</td>
                <td className="px-6 py-4 opacity-80">
                  {formatDob(student.dob)}
                </td>
                <td className="px-6 py-4 opacity-80">
                  {student.Cpp_score ?? "-"}
                </td>
                <td className="px-6 py-4 opacity-80">
                  {student.C_score ?? "-"}
                </td>
                <td className="px-6 py-4 opacity-80">{student.grade ?? "-"}</td>

                <td className="px-6 py-4">
                  {student.certificate_status === "approved" ? (
                    <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Approved
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApproveCertificate?.(student.id)}
                      disabled={!onApproveCertificate}
                      className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
                    >
                      Approve
                    </button>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemove(student.id)}
                      title="Removes the student from this class only; their account is kept"
                      className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-700"
                    >
                      Remove from Class
                    </button>
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
