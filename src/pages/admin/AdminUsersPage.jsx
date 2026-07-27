import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/adminApi";
import UserTable from "../../components/admin/UserTable";
import LoadingTable from "../../components/common/LoadingTable";

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

  return (
    <section>
      <div className="rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Users
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Manage user roles and accounts.
            </p>
          </div>

          {!loading && (
            <div className="rounded-lg bg-black/5 px-4 py-2 text-sm font-medium dark:bg-white/10">
              Total Users: {users.length}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              something went wrong
            </div>
          )}

          {loading ? (
            <LoadingTable rows={8} />
          ) : (
            <div className="overflow-x-auto">
              <UserTable
                users={users}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
