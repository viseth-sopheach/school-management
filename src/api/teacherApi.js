import axiosClient from "./axiosClient";

export const getClass = (classId) =>
  axiosClient.get(`/teacher/classes/${classId}`);

export const getMyClasses = () => axiosClient.get("/teacher/classes");

export const addStudent = (data) => axiosClient.post("/teacher/students", data);

export const addScore = (data) => axiosClient.post("/teacher/scores", data);

export const updateStudent = (id, data) =>
  axiosClient.put(`/teacher/${id}`, data);

export const deleteStudent = (id) => axiosClient.delete(`/teacher/${id}`);

export const getMe = () => axiosClient.get("/auth/me");
