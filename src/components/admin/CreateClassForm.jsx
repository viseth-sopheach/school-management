import { useState } from "react";

export default function CreateClassForm({ onCreate, teachers, isLoading }) {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onCreate({ name, teacher_id: teacherId || null });
      setName("");
      setTeacherId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        placeholder="Class name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40 sm:flex-1"
      />

      <select
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40 sm:w-56"
      >
        <option
          value=""
          className="bg-[#dfd3c3] text-[#16120f] dark:bg-[#16120f] dark:text-[#dfd3c3]"
        >
          Choose Teache
        </option>
        {teachers.map((teacher) => (
          <option
            key={teacher.id}
            value={teacher.id}
            className="bg-[#dfd3c3] text-[#16120f] dark:bg-[#16120f] dark:text-[#dfd3c3]"
          >
            {teacher.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Class"}
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 sm:basis-full">
          {error}
        </p>
      )}
    </form>
  );
}
