export default function LoadingTable({ rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-black/5 dark:bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="border-t border-black/10 dark:border-white/10"
              >
                <td className="px-6 py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-black/10 dark:bg-white/10"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-52 animate-pulse rounded bg-black/10 dark:bg-white/10"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-10 w-28 animate-pulse rounded-lg bg-black/10 dark:bg-white/10"></div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="ml-auto h-10 w-20 animate-pulse rounded-lg bg-black/10 dark:bg-white/10"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
