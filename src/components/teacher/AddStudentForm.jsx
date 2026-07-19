import { useState } from "react";

const initialState = {
  name: "",
  gender: "Male",
  dob: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export default function AddStudentForm({ onAdd }) {
  const [form, setForm] = useState(initialState);
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
      await onAdd(form);
      setForm(initialState);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: "Failed to add student." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stacked-form">
      <h3>Add Student</h3>
      {errors.general && <p className="form-error">{errors.general}</p>}

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      {errors.name && <p className="field-error">{errors.name[0]}</p>}

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input
        name="dob"
        type="date"
        value={form.dob}
        onChange={handleChange}
        required
      />
      {errors.dob && <p className="field-error">{errors.dob[0]}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p className="field-error">{errors.email[0]}</p>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        name="password_confirmation"
        type="password"
        placeholder="Confirm Password"
        value={form.password_confirmation}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Student"}
      </button>
    </form>
  );
}
