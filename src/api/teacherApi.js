import axiosClient from "./axiosClient";

export const getMe = () => axiosClient.get("/teacher/me");

// TODO: requires routes/api.php to expose {classId}, e.g.
// Route::get('/classes/{classId}', 'index')->name('teacher.classes.show');
export const getClass = (classId) =>
  axiosClient.get(`/teacher/classes/${classId}`);

export const addStudent = (data) => axiosClient.post("/teacher/students", data);

export const addScore = (data) => axiosClient.post("/teacher/scores", data);

export const updateStudent = (id, data) =>
  axiosClient.put(`/teacher/${id}`, data);

export const deleteStudent = (id) => axiosClient.delete(`/teacher/${id}`);
