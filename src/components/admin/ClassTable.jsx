export default function ClassTable({ classes }) {
  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 dark:border-white/20 py-12 text-center">
        <p className="text-lg font-medium opacity-70">No classes found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Class Name</th>
              <th className="px-6 py-4 text-left font-semibold">Teacher</th>
              <th className="px-6 py-4 text-left font-semibold">Students</th>
              <th className="px-6 py-4 text-left font-semibold">Created</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((classItem) => (
              <tr
                key={classItem.id}
                className="border-t border-black/10 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {classItem.name}
                </td>

                <td className="px-6 py-4 opacity-80">
                  {classItem.teacher?.name ?? "Unassigned"}
                </td>

                <td className="px-6 py-4 opacity-80">
                  {classItem.students_count}
                </td>

                <td className="px-6 py-4 opacity-80">
                  {new Date(classItem.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}