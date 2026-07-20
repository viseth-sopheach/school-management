const ROLES = ["admin", "teacher", "student"];

export default function RoleSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {ROLES.map((role) => (
        <option
          key={role}
          value={role}
          className="bg-[#dfd3c3] text-[#16120f] dark:bg-[#16120f] dark:text-[#dfd3c3]"
        >
          {role}
        </option>
      ))}
    </select>
  );
}
