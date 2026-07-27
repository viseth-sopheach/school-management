import { NavLink } from "react-router-dom";
import { FiUsers } from "@react-icons/all-files/fi/FiUsers";
import { FiGrid } from "@react-icons/all-files/fi/FiGrid";
import { FiBookOpen } from "@react-icons/all-files/fi/FiBookOpen";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { FiX } from "@react-icons/all-files/fi/FiX";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import { MdOutlineSpaceDashboard } from "react-icons/md";

const ROLE_LINKS = {
  admin: [
    {
      to: "/admin",
      label: "Dashboard",
      icon: MdOutlineSpaceDashboard,
      end: true,
    },
    { to: "/admin/classes", label: "Classes", icon: FiGrid },
    { to: "/admin/users", label: "Users", icon: FiUsers },
  ],
  teacher: [
    { to: "/teacher", label: "Dashboard", icon: MdOutlineSpaceDashboard, end: true },
    { to: "/teacher/classes", label: "Classes", icon: FiGrid },
  ],
  student: [
    { to: "/student", label: "Dashboard", icon: FiBookOpen, end: true },
    { to: "/student/me", label: "My Info", icon: FiUser },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const { isOpen, isCollapsed, closeSidebar } = useSidebar();

  if (!user) return null;

  const links = ROLE_LINKS[user.role] ?? [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col border-r border-black/10 bg-[var(--color-bg)] transition-transform duration-200 dark:border-white/10 md:sticky md:top-0 md:h-screen md:max-w-none md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "md:w-14" : "md:w-52"}`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {!isCollapsed && <span className="font-semibold">Menu</span>}
          <button
            onClick={closeSidebar}
            className="rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black/10 dark:bg-white/10"
                    : "opacity-80 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
