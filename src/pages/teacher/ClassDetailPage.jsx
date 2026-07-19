import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClass, updateStudent, deleteStudent } from "../../api/teacherApi";
import StudentTable from "../../components/teacher/StudentTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ClassDetailPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClass = async () => {
    try {
      const { data } = await getClass(classId);
      setClassData(data.class);
    } catch (err) {
      setError(
        "Failed to load class. This route may not exist on the backend yet.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClass();
  }, [classId]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Delete this student?")) return;
    await deleteStudent(studentId);
    setClassData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
    }));
  };

  const handleEdit = async (student) => {
    const name = window.prompt("New name", student.name);
    if (!name) return;
    await updateStudent(student.id, { name });
    setClassData((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === student.id ? { ...s, name } : s,
      ),
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="page">
      <h1>{classData?.name}</h1>
      <StudentTable
        students={classData?.students || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
