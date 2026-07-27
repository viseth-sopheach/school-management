const LETTER_GRADE_STYLES = {
  A: "text-emerald-600 dark:text-emerald-400",
  "A-": "text-emerald-600 dark:text-emerald-400",
  "B+": "text-sky-600 dark:text-sky-400",
  B: "text-sky-600 dark:text-sky-400",
  "C+": "text-amber-600 dark:text-amber-400",
  C: "text-amber-600 dark:text-amber-400",
  "D+": "text-orange-600 dark:text-orange-400",
  D: "text-orange-600 dark:text-orange-400",
  F: "text-red-600 dark:text-red-400",
};

function StatBlock({ label, value }) {
  return (
    <div className="rounded-xl bg-black/[0.03] p-4 text-center dark:bg-white/[0.03]">
      <p className="text-xs font-medium uppercase tracking-wide opacity-60">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function GradeSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-xl bg-black/10 dark:bg-white/10"
        />
      ))}
    </div>
  );
}

export default function GradeCard({ grade, loading, error }) {
  const hasScores = Boolean(grade) && grade.subject_count > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-black/10 px-6 py-5 dark:border-white/10">
        <h2 className="text-xl font-semibold">My GPA</h2>
      </div>

      <div className="p-6">
        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            something went wrong
          </p>
        )}

        {loading ? (
          <GradeSkeleton />
        ) : hasScores ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock label="Subjects" value={grade.subject_count} />
            <StatBlock
              label="Average Score"
              value={grade.average_score.toFixed(2)}
            />
            <StatBlock label="GPA" value={grade.gpa.toFixed(1)} />
            <div className="rounded-xl bg-black/[0.03] p-4 text-center dark:bg-white/[0.03]">
              <p className="text-xs font-medium uppercase tracking-wide opacity-60">
                Letter Grade
              </p>
              <p
                className={`mt-1 text-xl font-bold ${
                  LETTER_GRADE_STYLES[grade.letter_grade] ?? ""
                }`}
              >
                {grade.letter_grade}
              </p>
            </div>
          </div>
        ) : (
          !error && <p className="text-sm opacity-70">Not graded yet.</p>
        )}
      </div>
    </div>
  );
}
