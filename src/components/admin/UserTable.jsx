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
    return <p>No users found.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <RoleSelect
                value={user.role}
                disabled={updatingId === user.id}
                onChange={(role) => handleRoleChange(user.id, role)}
              />
            </td>
            <td>
              <button onClick={() => onDelete(user.id)} className="danger">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
