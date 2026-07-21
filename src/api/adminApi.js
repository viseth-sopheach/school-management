import axiosClient from "./axiosClient";

export const getAllUsers = () => axiosClient.get("/admin/users");

export const getTeachers = () => axiosClient.get("/admin/teachers");

export const getAllClasses = () => axiosClient.get("/admin/classes");

export const updateUserRole = (userId, role) =>
  axiosClient.put(`/admin/users/${userId}`, { role });

export const deleteUser = (userId) =>
  axiosClient.delete(`/admin/users/${userId}`);

export const createClass = (data) => axiosClient.post("/admin/classes", data);

export const getMe = () => axiosClient.get("/auth/me");
