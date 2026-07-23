import { useEffect, useState } from "react";
import { getAvailableStudents } from "../../api/teacherApi";

export default function AttachStudentForm({ onAttach }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAvailableStudents()
      .then(({ data }) => setStudents(data.students))
      .catch(() => setError("Failed to load available students."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    setError("");
    setSubmitting(true);

    try {
      await onAttach(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== Number(studentId)));
      setStudentId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm opacity-70">Loading students...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <select
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
        className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40 sm:flex-1"
      >
        <option
          value=""
          className="bg-[var(--color-bg)] text-[var(--color-text)]"
        >
          {students.length === 0 ? "No unassigned students" : "Choose student"}
        </option>
        {students.map((student) => (
          <option
            key={student.id}
            value={student.id}
            className="bg-[var(--color-bg)] text-[var(--color-text)]"
          >
            {student.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={submitting || !studentId}
        className="rounded-md bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Adding..." : "Add Student"}
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 sm:basis-full">
          {error}
        </p>
      )}
    </form>
  );
}
