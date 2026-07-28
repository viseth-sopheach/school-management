import axiosClient from "./axiosClient";

export const getMyClasses = () => axiosClient.get("/teacher/classes");
export const getClass = (classId) =>
  axiosClient.get(`/teacher/classes/${classId}`);

export const addStudent = (data) => axiosClient.post("/teacher/students", data);

export const addScore = (data) => axiosClient.post("/teacher/scores", data);

export const updateStudent = (id, data) =>
  axiosClient.put(`/teacher/${id}`, data);

export const deleteStudent = (id) => axiosClient.delete(`/teacher/${id}`);

export const approveCertificate = (studentId) =>
  axiosClient.put(`/teacher/students/${studentId}/certificate/approve`);

export const removeStudentFromClass = (classId, studentId) =>
  axiosClient.delete(`/teacher/classes/${classId}/students/${studentId}`);

export const getMe = () => axiosClient.get("/auth/me");

export const getAllStudents = () => axiosClient.get("/teacher/students/all");

export const attachStudent = (classId, studentId) =>
  axiosClient.post(`/teacher/classes/${classId}/students/attach`, {
    student_id: studentId,
  });