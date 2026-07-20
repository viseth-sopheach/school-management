import axiosClient from "./axiosClient";

export const login = (credentials) => axiosClient.post("/auth/login", credentials);

export const register = (data) => axiosClient.post("/auth/register", data);

export const logout = () => axiosClient.post("/auth/logout");

export const getCurrentUser = () => axiosClient.get("/auth/me");
