import axiosClient from "./axiosClient";

export const getMe = () => axiosClient.get(`/student/me`);
export const getAccount = () => axiosClient.get(`/auth/me`);
export const getDashboard = () => axiosClient.get("/student/dashboard");
export const getGrade = () => axiosClient.get("/student/grade");
export const getCertificate = () => axiosClient.get("/student/certificate");
export const exportCertificate = () =>
  axiosClient.get("/student/certificate/export", { responseType: "blob" });

export const logout = () => axiosClient.post("/student/logout");
