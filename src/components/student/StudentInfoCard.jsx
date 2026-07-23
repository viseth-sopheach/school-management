function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-black/[0.03] p-4 dark:bg-white/[0.03]">
      <span className="text-sm opacity-70">{label}</span>
      <span className="font-semibold">{value ?? "-"}</span>
    </div>
  );
}

export default function StudentInfoCard({ student }) {
  if (!student) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-black/10 px-6 py-5 dark:border-white/10">
        <h2 className="text-xl font-semibold">My Information</h2>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <InfoRow label="Full Name" value={student.name} />
        <InfoRow label="Student ID" value={student.student_id} />
        <InfoRow label="Email" value={student.email} />
        <InfoRow label="Class" value={student.class_name || "Not assigned"} />
        <InfoRow
          label="Teacher"
          value={student.teacher_name || "Not assigned"}
        />
        <InfoRow label="Enrollment Date" value={student.enrolled_at || "-"} />
        <InfoRow label="Academic Status" value={student.academic_status} />
      </div>
    </div>
  );
}
