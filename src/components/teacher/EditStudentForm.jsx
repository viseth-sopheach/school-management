import { useState } from "react";

export default function EditStudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: student.name || "",
    gender: student.gender || "Male",
    dob: student.dob ? student.dob.slice(0, 10) : "",
    Cpp_score: student.Cpp_score ?? "",
    C_score: student.C_score ?? "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="Cpp_score"
              className="mb-1 block text-xs font-medium opacity-70"
            >
              C++ Score
            </label>
            <input
              id="Cpp_score"
              name="Cpp_score"
              type="number"
              step="0.1"
              value={form.Cpp_score}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.Cpp_score && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.Cpp_score[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="C_score"
              className="mb-1 block text-xs font-medium opacity-70"
            >
              C Score
            </label>
            <input
              id="C_score"
              name="C_score"
              type="number"
              step="0.1"
              value={form.C_score}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.C_score && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.C_score[0]}
              </p>
            )}
          </div>
        </div>
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
