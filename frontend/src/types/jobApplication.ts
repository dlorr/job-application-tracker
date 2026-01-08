export type ApplicationStatus =
  | "APPLIED"
  | "VIEWED"
  | "IN_PROGRESS"
  | "REJECTED"
  | "GHOSTED"
  | "COMPLETED";

export type ApplicationProgress =
  | "INITIAL_INTERVIEW"
  | "TECHNICAL_INTERVIEW"
  | "TECHNICAL_EXAM"
  | "FINAL_INTERVIEW"
  | "JOB_OFFER";

export type JobApplication = {
  id: string;
  company: string;
  jobPosition: string;
  jobLink: string;
  status: ApplicationStatus;
  progress?: ApplicationProgress;
  interviewDate?: string;
  hasForm: boolean;
  dateApplied: string;
  dateUpdated: string;
  createdAt: string;
};
