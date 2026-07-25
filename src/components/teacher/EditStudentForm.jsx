import { useState } from "react";

function buildInitialScores(student, subjects) {
  return subjects.reduce((acc, subject) => {
    const existing = student.scores?.find((s) => s.subject_id === subject.id);
    acc[subject.id] = existing?.score ?? "";
    return acc;
  }, {});
}

export default function EditStudentForm({
  student,
  subjects,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: student.name || "",
    gender: student.gender || "Male",
    dob: student.dob ? student.dob.slice(0, 10) : "",
    scores: buildInitialScores(student, subjects),
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScoreChange = (subjectId, value) => {
    setForm((prev) => ({
      ...prev,
      scores: { ...prev.scores, [subjectId]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await onSave(student.id, form);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: "Failed to update student." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Editing {student.name}</h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs opacity-60 transition hover:opacity-100"
        >
          Cancel
        </button>
      </div>

      {errors.general && (
        <p className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {errors.general}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-xs font-medium opacity-70"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="dob"
            className="mb-1 block text-xs font-medium opacity-70"
          >
            Date of Birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.dob && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.dob[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="gender"
            className="mb-1 block text-xs font-medium opacity-70"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={inputClass}
          >
            <option
              value="Male"
              className="bg-[var(--color-bg)] text-[var(--color-text)]"
            >
              Male
            </option>
            <option
              value="Female"
              className="bg-[var(--color-bg)] text-[var(--color-text)]"
            >
              Female
            </option>
          </select>
        </div>

        {subjects.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-3">
            {subjects.map((subject) => (
              <div key={subject.id}>
                <label
                  htmlFor={`score-${subject.id}`}
                  className="mb-1 block text-xs font-medium opacity-70"
                >
                  {subject.subject_name}
                </label>
                <input
                  id={`score-${subject.id}`}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={form.scores[subject.id] ?? ""}
                  onChange={(e) =>
                    handleScoreChange(subject.id, e.target.value)
                  }
                  className={inputClass}
                />
                {errors[`scores.${subject.id}`] && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors[`scores.${subject.id}`][0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded-md bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
