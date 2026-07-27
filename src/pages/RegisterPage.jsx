import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye } from "@react-icons/all-files/fi/FiEye";
import { FiEyeOff } from "@react-icons/all-files/fi/FiEyeOff";
import { register } from "../api/authApi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-black/10 bg-black/[0.03] p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <h1 className="mb-6 text-2xl font-semibold">Register</h1>

        {errors.general && (
          <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {errors.general}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 pr-10 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 opacity-60 transition hover:opacity-100"
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="mb-1 block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                value={form.password_confirmation}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 pr-10 text-sm outline-none transition focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                aria-label={
                  showPasswordConfirmation
                    ? "Hide password confirmation"
                    : "Show password confirmation"
                }
                className="absolute inset-y-0 right-0 flex items-center px-3 opacity-60 transition hover:opacity-100"
              >
                {showPasswordConfirmation ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm opacity-80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium underline underline-offset-2"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
