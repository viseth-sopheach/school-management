export default function ClassDetailSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Gender</th>
              <th className="px-6 py-4 text-left font-semibold">DOB</th>
              <th className="px-6 py-4 text-left font-semibold">Grade</th>
              <th className="px-6 py-4 text-left font-semibold">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t border-black/10 dark:border-white/10">
                {Array.from({ length: 5 }).map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}