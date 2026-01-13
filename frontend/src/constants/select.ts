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
