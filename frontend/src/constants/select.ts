// src/constants/select.ts

import type {
  ApplicationProgress,
  ApplicationStatus,
} from "../types/jobApplication";

export const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  VIEWED: "Viewed",
  IN_PROGRESS: "In Progress",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  COMPLETED: "Completed",
};

export const progressLabels: Record<ApplicationProgress, string> = {
  INITIAL_INTERVIEW: "Initial Interview",
  TECHNICAL_INTERVIEW: "Technical Interview",
  TECHNICAL_EXAM: "Technical Exam",
  FINAL_INTERVIEW: "Final Interview",
  JOB_OFFER: "Job Offer",
};

export const statusColors: Record<string, string> = {
  APPLIED: "text-white-400",
  VIEWED: "text-green-400",
  IN_PROGRESS: "text-yellow-400",
  REJECTED: "text-red-500",
  GHOSTED: "text-gray-500",
  COMPLETED: "text-blue-400",
};
