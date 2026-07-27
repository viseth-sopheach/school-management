import axios from "axios";
import axiosClient from "./axiosClient";

export const getAllUsers = () => axiosClient.get("/admin/users");
export const getTeachers = () => axiosClient.get("/admin/teachers");
export const getAllClasses = () => axiosClient.get("/admin/classes");
export const updateUserRole = (userId, role) => axiosClient.put(`/admin/users/${userId}`, { role });
export const deleteUser = (userId) => axiosClient.delete(`/admin/users/${userId}`);
export const createClass = (data) => axiosClient.post("/admin/classes", data);
export const getMe = () => axiosClient.get("/auth/me");
export const addSubject = (classId, data) => axiosClient.post(`/admin/classes/${classId}/subjects`, data);
export const updateSubject = (subjectId, data) => axiosClient.put(`/admin/subjects/${subjectId}`, data);
export const deleteSubject = (subjectId) => axiosClient.delete(`/admin/subjects/${subjectId}`);
export const updateStudentScore = (studentId, scores) => axiosClient.put(`/admin/students/${studentId}/scores`, { scores });
export const getClass = (classId) => axiosClient.get(`/admin/classes/${classId}`);
export const updateStudent = (studentId, data) => axiosClient.put(`/admin/students/${studentId}`, data); 
export const removeStudentFromClass = (classId, studentId) => axiosClient.delete(`/admin/classes/${classId}/students/${studentId}`);