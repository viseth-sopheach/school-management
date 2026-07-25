const MAX_VISIBLE_SUBJECTS = 3;

function SubjectBadges({ subjects }) {
  if (!subjects?.length) {
    return <span className="text-xs opacity-50">No subjects</span>;
  }

  const sorted = [...subjects].sort((a, b) =>
    a.subject_name.localeCompare(b.subject_name),
  );
  const visible = sorted.slice(0, MAX_VISIBLE_SUBJECTS);
  const hiddenCount = sorted.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((subject) => (
        <span
          key={subject.id}
          className="rounded-full bg-black/10 px-2.5 py-0.5 text-xs font-medium dark:bg-white/10"
        >
          {subject.subject_name}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span
          className="rounded-full border border-black/15 px-2.5 py-0.5 text-xs font-medium opacity-70 dark:border-white/15"
          title={sorted
            .slice(MAX_VISIBLE_SUBJECTS)
            .map((s) => s.subject_name)
            .join(", ")}
        >
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}

export default function ClassTable({ classes }) {
  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 py-12 text-center dark:border-white/20">
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
              <th className="px-6 py-4 text-left font-semibold">Subjects</th>
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

                <td className="px-6 py-4">
                  <SubjectBadges subjects={classItem.subjects} />
                </td>

                <td className="px-6 py-4 opacity-80">
                  {classItem.students_count}
                </td>

                <td className="px-6 py-4 whitespace-nowrap opacity-80">
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
