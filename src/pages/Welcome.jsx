import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ROLE_HOME = {
  admin: "/admin/users",
  teacher: "/teacher",
  student: "/student",
};

export default function Welcome() {
  const { user } = useAuth();

  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* <span className="mb-4 rounded-full bg-black/5 px-4 py-1.5 text-xs font-medium tracking-wide uppercase opacity-70 dark:bg-white/10">
        School Management System
      </span> */}

      <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
        Welcome to Viseth's School Management System
      </h1>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {user ? (
          <Link
            to={ROLE_HOME[user.role] ?? "/"}
            className="rounded-md bg-[var(--color-text)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-md bg-[var(--color-text)] px-6 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md border border-black/15 px-6 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
