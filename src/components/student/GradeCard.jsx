export default function GradeCard({ grade }) {
  return (
    <div className="grade-card">
      <h3>Your Grade</h3>
      <p className="grade-value">{grade ?? "Not graded yet"}</p>
    </div>
  );
}
