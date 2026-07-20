import { Link, useNavigate } from "react-router-dom";
import { FiSun } from "@react-icons/all-files/fi/FiSun";
import { FiMoon } from "@react-icons/all-files/fi/FiMoon";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { FiLogOut } from "@react-icons/all-files/fi/FiLogOut";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useSidebar } from "../../hooks/useSidebar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur dark:border-white/10 sm:px-6 lg:px-10 xl:px-16">
      <div className="flex items-center gap-3">
        {user && (
          <button
            onClick={openSidebar}
            className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
            aria-label="Open sidebar"
          >
            <FiMenu className="h-5 w-5" />
          </button>
        )}
        <span className="text-lg font-semibold tracking-tight">
          School Management
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <FiSun className="h-4 w-4" />
          ) : (
            <FiMoon className="h-4 w-4" />
          )}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="rounded-md bg-[var(--color-text)] px-3 py-1.5 text-sm font-medium text-[var(--color-bg)] hover:opacity-90"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
