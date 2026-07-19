import axiosClient from "./axiosClient";

export const getMe = (id) => axiosClient.get(`/student/me`, { params: { id } });

export const getGrade = () => axiosClient.get("/student/grade");

export const logout = () => axiosClient.post("/student/logout");
