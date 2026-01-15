export type UpdateJobApplicationDTO = {
  company: string;
  jobPosition: string;
  jobLink: string;
  status?:
    | "APPLIED"
    | "VIEWED"
    | "IN_PROGRESS"
    | "REJECTED"
    | "GHOSTED"
    | "COMPLETED";
  progress?:
    | "INITIAL_INTERVIEW"
    | "TECHNICAL_INTERVIEW"
    | "TECHNICAL_EXAM"
    | "FINAL_INTERVIEW"
    | "JOB_OFFER";
  dateApplied?: Date;
  dateCompleted?: Date;
  interviewDate?: Date;
  hasForm?: boolean;
};
