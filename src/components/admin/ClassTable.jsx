import { useEffect, useState } from "react";
import { addSubject, updateSubject, deleteSubject } from "../../api/adminApi";
import { Link } from "react-router-dom";

// const MAX_VISIBLE_SUBJECTS = 3;

function sortSubjects(subjects) {
  return [...(subjects || [])].sort((a, b) =>
    a.subject_name.localeCompare(b.subject_name),
  );
}

function SubjectBadges({ subjects, onSeeAll }) {
  if (!subjects?.length) {
    return (
      <button
        type="button"
        onClick={onSeeAll}
        className="rounded-full border border-dashed border-black/15 px-3 py-1 text-xs font-medium opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:border-white/15 dark:hover:bg-white/10"
      >
        No subjects · Add
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSeeAll}
      className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium opacity-80 transition hover:bg-black/5 hover:opacity-100 dark:border-white/15 dark:hover:bg-white/10"
    >
      {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
    </button>
  );
}

function ManageSubjectsModal({ classItem, onClose, onSubjectsChange }) {
  const [subjects, setSubjects] = useState(sortSubjects(classItem.subjects));
  const [newSubjectName, setNewSubjectName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setSubjects(sortSubjects(classItem.subjects));
  }, [classItem]);

  const applyChange = (nextSubjects) => {
    const sorted = sortSubjects(nextSubjects);
    setSubjects(sorted);
    onSubjectsChange(classItem.id, sorted);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newSubjectName.trim();
    if (!name) return;

    setError("");
    setAdding(true);

    try {
      const { data } = await addSubject(classItem.id, { subject_name: name });
      applyChange([...subjects, data.subject]);
      setNewSubjectName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (subject) => {
    setError("");
    setEditingId(subject.id);
    setEditingValue(subject.subject_name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleSaveEdit = async (subject) => {
    const name = editingValue.trim();
    if (!name) return;

    setError("");
    setSavingId(subject.id);

    try {
      const { data } = await updateSubject(subject.id, { subject_name: name });
      applyChange(
        subjects.map((s) => (s.id === subject.id ? data.subject : s)),
      );
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subject.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`Delete "${subject.subject_name}"?`)) return;

    setError("");
    setDeletingId(subject.id);

    try {
      await deleteSubject(subject.id);
      applyChange(subjects.filter((s) => s.id !== subject.id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subject.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-black/10 bg-[var(--color-bg)] p-6 text-[var(--color-text)] shadow-xl dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{classItem.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mb-3 text-sm opacity-70">
          {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
        </p>

        {error && (
          <p className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {subjects.length === 0 && (
            <p className="text-sm opacity-60">No subjects yet.</p>
          )}

          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 dark:border-white/10"
            >
              {editingId === subject.id ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    autoFocus
                    className="min-w-0 flex-1 rounded-md border border-black/15 bg-transparent px-2 py-1 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(subject)}
                    disabled={savingId === subject.id}
                    className="shrink-0 text-xs font-medium text-emerald-600 hover:underline disabled:opacity-50 dark:text-emerald-400"
                  >
                    {savingId === subject.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="shrink-0 text-xs font-medium opacity-70 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {subject.subject_name}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(subject)}
                    className="shrink-0 text-xs font-medium opacity-70 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(subject)}
                    disabled={deletingId === subject.id}
                    className="shrink-0 text-xs font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                  >
                    {deletingId === subject.id ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="New subject name"
            className="min-w-0 flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
          />
          <button
            type="submit"
            disabled={adding || !newSubjectName.trim()}
            className="shrink-0 rounded-md bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </form>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/15 px-4 py-2 text-xs font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClassTable({ classes, onSubjectsChange }) {
  const [selectedClassId, setSelectedClassId] = useState(null);

  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 py-12 text-center dark:border-white/20">
        <p className="text-lg font-medium opacity-70">No classes found.</p>
      </div>
    );
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Class Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">Teacher</th>
                <th className="px-6 py-4 text-left font-semibold">Subjects</th>
                <th className="px-6 py-4 text-left font-semibold">Students</th>
                <th className="px-6 py-4 text-left font-semibold">Created</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((classItem) => (
                <tr
                  key={classItem.id}
                  className="border-t border-black/10 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {classItem.name}
                  </td>

                  <td className="px-6 py-4 opacity-80">
                    {classItem.teacher?.name ?? "Unassigned"}
                  </td>

                  <td className="px-6 py-4">
                    <SubjectBadges
                      subjects={classItem.subjects}
                      onSeeAll={() => setSelectedClassId(classItem.id)}
                    />
                  </td>

                  <td className="px-6 py-4 opacity-80">
                    {classItem.students_count}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap opacity-80">
                    {new Date(classItem.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/classes/${classItem.id}`}
                      className="rounded-lg bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90"
                    >
                      View class
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClass && (
        <ManageSubjectsModal
          classItem={selectedClass}
          onClose={() => setSelectedClassId(null)}
          onSubjectsChange={onSubjectsChange}
        />
      )}
    </>
  );
}
