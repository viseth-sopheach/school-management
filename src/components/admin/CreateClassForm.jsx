import { useState } from "react";

export default function CreateClassForm({ onCreate, teachers, isLoading }) {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subjects, setSubjects] = useState([""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubjectChange = (index, value) => {
    setSubjects((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const addSubjectField = () => {
    setSubjects((prev) => [...prev, ""]);
  };

  const removeSubjectField = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedSubjects = subjects
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (cleanedSubjects.length === 0) {
      setError("Add at least one subject.");
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        name,
        teacher_id: teacherId || null,
        subjects: cleanedSubjects,
      });
      setName("");
      setTeacherId("");
      setSubjects([""]);
    } catch (err) {
      setError(err.response?.data?.message || "something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || isLoading;
  const inputClass =
    "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="className" className="mb-1 block text-sm font-medium">
          Class name
        </label>
        <input
          id="className"
          type="text"
          placeholder="React.js class"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="teacherId" className="mb-1 block text-sm font-medium">
          Teacher
        </label>
        <select
          id="teacherId"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className={inputClass}
        >
          <option
            value=""
            className="bg-[var(--color-bg)] text-[var(--color-text)]"
          >
            Choose teacher
          </option>
          {teachers.map((teacher) => (
            <option
              key={teacher.id}
              value={teacher.id}
              className="bg-[var(--color-bg)] text-[var(--color-text)]"
            >
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Subjects</span>

        <div className="space-y-2">
          {subjects.map((subject, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder={`Subject ${index + 1}`}
                value={subject}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                className={inputClass}
              />
              {subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubjectField(index)}
                  className="shrink-0 rounded-md border border-black/15 px-3 text-sm transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                  aria-label={`Remove subject ${index + 1}`}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSubjectField}
          className="mt-2 text-sm font-medium underline underline-offset-2 opacity-80 hover:opacity-100"
        >
          + Add another subject
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">something went wrong</p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Class"}
      </button>
    </form>
  );
}
