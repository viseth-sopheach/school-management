import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/adminApi";
import UserTable from "../../components/admin/UserTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data.user);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    await updateUserRole(userId, role);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page">
      <h1>Users</h1>
      {error && <p className="form-error">{error}</p>}
      <UserTable
        users={users}
        onRoleChange={handleRoleChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
