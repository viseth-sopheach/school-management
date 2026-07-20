import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun } from "@react-icons/all-files/fi/FiSun";
import { FiMoon } from "@react-icons/all-files/fi/FiMoon";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { FiX } from "@react-icons/all-files/fi/FiX";
import { FiLogOut } from "@react-icons/all-files/fi/FiLogOut";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

const ROLE_LINKS = {
  admin: [
    { to: "/admin/users", label: "Users" },
    { to: "/admin/classes", label: "Classes" },
  ],
  teacher: [{ to: "/teacher", label: "Dashboard" }],
  student: [{ to: "/student", label: "Dashboard" }],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = user ? (ROLE_LINKS[user.role] ?? []) : [];

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-[var(--color-bg)]/95 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <span className="text-lg font-semibold tracking-tight">
          School Management
        </span>

        {links.length > 0 && (
          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium opacity-80 transition hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {user ? (
            <>
              <div className="hidden items-center gap-3 border-l border-black/10 pl-3 md:flex dark:border-white/10">
                <span className="text-sm opacity-80">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>

              {links.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="rounded-md p-2 transition hover:bg-black/5 md:hidden dark:hover:bg-white/10"
                  aria-label="Toggle menu"
                >
                  {menuOpen ? (
                    <FiX className="h-5 w-5" />
                  ) : (
                    <FiMenu className="h-5 w-5" />
                  )}
                </button>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-[var(--color-text)] px-3 py-1.5 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen && user && links.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-black/10 px-4 pb-4 md:hidden dark:border-white/10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-1.5 border-t border-black/10 px-3 pt-3 text-sm font-medium transition hover:opacity-80 dark:border-white/10"
          >
            <FiLogOut className="h-4 w-4" />
            Logout ({user.name})
          </button>
        </div>
      )}
    </nav>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-4 w-4" />
      ) : (
        <FiMoon className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
