import axiosClient from "./axiosClient";

export const getMe = () => axiosClient.get(`/student/me`);
export const getAccount = () => axiosClient.get(`/auth/me`);
export const getGrade = () => axiosClient.get("/student/grade");
export const logout = () => axiosClient.post("/student/logout");
