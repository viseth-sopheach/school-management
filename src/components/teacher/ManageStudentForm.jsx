import { useState } from "react";

const initialState = {
  name: "",
  gender: "Male",
  dob: "",
  Cpp_score: "",
  C_score: "",
};

export default function ManageStudentForm({ onUpdate, onDelete }) {
  const [studentId, setStudentId] = useState("");
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    setErrors({});
    setSubmitting(true);

    try {
      await onUpdate(studentId, form);
      setForm(initialState);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 404) {
        setErrors({ general: "Student not found." });
      } else {
        setErrors({ general: "Failed to update student." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!studentId) return;
    if (!window.confirm(`Delete student #${studentId}?`)) return;

    setErrors({});
    setDeleting(true);

    try {
      await onDelete(studentId);
      setStudentId("");
      setForm(initialState);
    } catch (err) {
      if (err.response?.status === 404) {
        setErrors({ general: "Student not found." });
      } else {
        setErrors({ general: "Failed to delete student." });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="stacked-form">
      <h3 className="mb-1 text-lg font-semibold">Manage Student</h3>
      <p className="mb-3 text-xs opacity-70">
        Enter a student ID to update or remove their record.
      </p>

      {errors.general && <p className="form-error">{errors.general}</p>}

      <input
        type="number"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
        className="mb-3"
      />

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      {errors.name && <p className="field-error">{errors.name[0]}</p>}

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input name="dob" type="date" value={form.dob} onChange={handleChange} />
      {errors.dob && <p className="field-error">{errors.dob[0]}</p>}

      <input
        name="Cpp_score"
        type="number"
        step="0.1"
        placeholder="C++ Score"
        value={form.Cpp_score}
        onChange={handleChange}
        required
      />
      {errors.Cpp_score && <p className="field-error">{errors.Cpp_score[0]}</p>}

      <input
        name="C_score"
        type="number"
        step="0.1"
        placeholder="C Score"
        value={form.C_score}
        onChange={handleChange}
        required
      />
      {errors.C_score && <p className="field-error">{errors.C_score[0]}</p>}

      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={submitting || deleting}>
          {submitting ? "Updating..." : "Update Student"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting || deleting}
          className="danger"
        >
          {deleting ? "Deleting..." : "Delete Student"}
        </button>
      </div>
    </form>
  );
}
