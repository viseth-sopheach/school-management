export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onApproveCertificate,
}) {
  if (students.length === 0) {
    return <p>No students in this class yet.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>DOB</th>
          <th>C++ Score</th>
          <th>C Score</th>
          <th>Grade</th>
          <th>Certificate</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.name}</td>
            <td>{student.gender}</td>
            <td>{student.dob}</td>
            <td>{student.Cpp_score ?? "-"}</td>
            <td>{student.C_score ?? "-"}</td>
            <td>{student.grade ?? "-"}</td>
            <td>
              {student.certificate_status === "approved" ? (
                <span className="certificate-badge certificate-badge--approved">
                  Approved
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onApproveCertificate?.(student.id)}
                  disabled={!onApproveCertificate}
                >
                  Approve certificate
                </button>
              )}
            </td>
            <td>
              <button onClick={() => onEdit(student)}>Edit</button>
              <button onClick={() => onDelete(student.id)} className="danger">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
