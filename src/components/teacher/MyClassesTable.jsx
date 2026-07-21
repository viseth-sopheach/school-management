import { Link } from "react-router-dom";

export default function MyClassesTable({ classes }) {
  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 dark:border-white/20 py-12 text-center">
        <p className="text-lg font-medium opacity-70">
          You haven't been assigned to any classes yet.
        </p>
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
              <th className="px-6 py-4 text-left font-semibold">Students</th>
              <th className="px-6 py-4 text-left font-semibold">Created</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
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
                  {classItem.students_count}
                </td>

                <td className="px-6 py-4 opacity-80">
                  {new Date(classItem.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <Link
                    to={`/teacher/classes/${classItem.id}`}
                    className="rounded-lg bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition hover:opacity-90"
                  >
                    View Roster
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
