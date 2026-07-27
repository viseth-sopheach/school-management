import { useState } from "react";

export default function ScoreForm({ onSubmit }) {
  const [form, setForm] = useState({ "C++_score": "", C_score: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(form);
      setForm({ "C++_score": "", C_score: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit score.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <input
        name="C++_score"
        type="number"
        step="0.1"
        placeholder="C++ Score"
        value={form["C++_score"]}
        onChange={handleChange}
        required
      />
      <input
        name="C_score"
        type="number"
        step="0.1"
        placeholder="C Score"
        value={form.C_score}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save Score"}
      </button>
      {error && <p className="form-error">something went wrong</p>}
    </form>
  );
}
