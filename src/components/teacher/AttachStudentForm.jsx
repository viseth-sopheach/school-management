import { useEffect, useState } from "react";
import { getAvailableStudents } from "../../api/teacherApi";

function AttachStudentFormSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="h-9 w-full animate-pulse rounded-md bg-black/10 dark:bg-white/10 sm:flex-1" />
      <div className="h-9 w-full animate-pulse rounded-md bg-black/10 dark:bg-white/10 sm:w-28" />
    </div>
  );
}

function dedupeById(students) {
  const seen = new Set();
  return students.filter((student) => {
    if (seen.has(student.id)) return false;
    seen.add(student.id);
    return true;
  });
}

function studentLabel(student) {
  return student.email ? `${student.name} (${student.email})` : student.name;
}

export default function AttachStudentForm({ onAttach }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAvailableStudents()
      .then(({ data }) => setStudents(dedupeById(data.students)))
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

  if (loading) return <AttachStudentFormSkeleton />;

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
            {studentLabel(student)}
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
          something went wrong
        </p>
      )}
    </form>
  );
}