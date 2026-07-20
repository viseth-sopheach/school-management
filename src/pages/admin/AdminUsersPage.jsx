import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/adminApi";
import UserTable from "../../components/admin/UserTable";
import LoadingTable from "../../components/admin/LoadingTable";

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

  if (loading) {
  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-lg">
          <div className="border-b border-black/10 dark:border-white/10 px-6 py-5">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="mt-1 text-sm opacity-70">
              Loading users...
            </p>
          </div>

          <div className="p-6">
            <LoadingTable rows={8} />
          </div>
        </div>
      </div>
    </section>
  );
}

  return (
    <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-lg">
          <div className="border-b border-black/10 dark:border-white/10 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Users
                </h1>
                <p className="mt-1 text-sm opacity-70">
                  Manage user roles and accounts.
                </p>
              </div>

              <div className="rounded-lg bg-black/5 dark:bg-white/10 px-4 py-2 text-sm font-medium">
                Total Users: {users.length}
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <UserTable
                users={users}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
