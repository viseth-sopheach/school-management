import axiosClient from "./axiosClient";

export const getAllUsers = () => axiosClient.get("/admin/users");

export const updateUserRole = (userId, role) =>
  axiosClient.put(`/admin/users/${userId}`, { role });

export const deleteUser = (userId) =>
  axiosClient.delete(`/admin/users/${userId}`);

// TODO: backend AdminController::store currently creates a User, not a class.
// This call matches the route/api.php entry as written, but will not behave
// as a "create class" endpoint until the controller is fixed.
export const createClass = (data) => axiosClient.post("/admin/classes", data);
