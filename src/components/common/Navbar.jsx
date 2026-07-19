import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <span className="navbar-brand">School Management</span>

      <div className="navbar-links">
        {user.role === "admin" && (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/classes">Classes</Link>
          </>
        )}
        {user.role === "teacher" && <Link to="/teacher">Dashboard</Link>}
        {user.role === "student" && <Link to="/student">Dashboard</Link>}
      </div>

      <div className="navbar-user">
        <span>{user.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
