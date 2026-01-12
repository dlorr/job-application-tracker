import axios from "axios";
import type { JobApplication } from "../types/jobApplication";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4003/api";

export const api = axios.create({
  baseURL: `${API_URL}/job-applications`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getApplications = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const res = await api.get("/", {
    params: { offset, limit },
  });

  return res.data as {
    data: JobApplication[];
    total: number;
  };
};

export const getApplication = (id: string) =>
  api.get(`/${id}`).then((res) => res.data);

export const createApplication = (data: any) =>
  api.post("/", data).then((res) => res.data);

export const updateApplication = (id: string, data: any) =>
  api.put(`/${id}`, data).then((res) => res.data);

export const deleteApplication = (id: string) =>
  api.delete(`/${id}`).then((res) => res.data);
