import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4003/api";

export const api = axios.create({
  baseURL: `${API_URL}/job-applications`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getApplications = (page: number, limit: number) =>
  api.get("/", { params: { page, limit } }).then((res) => res.data);

export const getApplication = (id: string) =>
  api.get(`/${id}`).then((res) => res.data);

export const createApplication = (data: any) =>
  api.post("/", data).then((res) => res.data);

export const updateApplication = (id: string, data: any) =>
  api.put(`/${id}`, data).then((res) => res.data);

export const deleteApplication = (id: string) =>
  api.delete(`/${id}`).then((res) => res.data);
