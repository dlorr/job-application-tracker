import { z } from "zod";

const baseString = z.string().trim().min(1).max(255);

export const createJobSchema = z.object({
  company: baseString,
  jobPosition: baseString,
  jobLink: z.string().trim().min(1).max(1000),
  dateApplied: z.coerce.date().min(1, "Date applied is required"),
});

export const updateJobSchema = z.object({
  // REQUIRED on update
  company: baseString,
  jobPosition: baseString,
  jobLink: z.string().trim().min(1).max(500),

  // OPTIONAL on update
  status: z
    .enum([
      "APPLIED",
      "VIEWED",
      "IN_PROGRESS",
      "REJECTED",
      "GHOSTED",
      "COMPLETED",
    ])
    .optional(),

  progress: z
    .enum([
      "INITIAL_INTERVIEW",
      "TECHNICAL_INTERVIEW",
      "TECHNICAL_EXAM",
      "FINAL_INTERVIEW",
      "JOB_OFFER",
    ])
    .optional(),

  interviewDate: z.coerce.date().optional(),
  dateCompleted: z.coerce.date().optional(),
  hasForm: z.boolean().optional(),
});
