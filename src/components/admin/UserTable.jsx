import { useState } from "react";
import RoleSelect from "./RoleSelect";

export default function UserTable({ users, onRoleChange, onDelete }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleRoleChange = async (userId, role) => {
    setUpdatingId(userId);
    try {
      await onRoleChange(userId, role);
    } finally {
      setUpdatingId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 dark:border-white/20 py-12 text-center">
        <p className="text-lg font-medium opacity-70">No users found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Role</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-black/10 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-sm opacity-80">{user.email}</td>

                <td className="px-6 py-4">
                  <RoleSelect
                    value={user.role}
                    disabled={updatingId === user.id}
                    onChange={(role) => handleRoleChange(user.id, role)}
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(user.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === user.id ? "Updating..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
