import { useState } from "react";

export default function CreateClassForm({ onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onCreate({ name });
      setName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <input
        type="text"
        placeholder="Class name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Class"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
