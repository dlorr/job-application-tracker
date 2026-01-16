import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  ApplicationProgress,
  ApplicationStatus,
  JobApplication,
} from "../types/jobApplication";
import { statusLabels, progressLabels } from "../constants/select";

export const applicationSchema = z
  .object({
    company: z.string().min(1, "Company is required").max(255),
    jobPosition: z.string().min(1, "Job Position is required").max(255),
    jobLink: z.string().min(1, "Job Link is required").max(1000),
    dateApplied: z.string().min(1, "Date applied is required"),
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
    interviewDate: z.string().optional(),
    dateCompleted: z.string().optional(),
    hasForm: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "IN_PROGRESS") {
      // progress required
      if (!data.progress) {
        ctx.addIssue({
          path: ["progress"],
          message: "Progress is required when status is In Progress",
          code: "custom",
        });
      }
      // interviewDate required
      if (!data.interviewDate) {
        ctx.addIssue({
          path: ["interviewDate"],
          message: "Interview date is required when status is In Progress",
          code: "custom",
        });
      }
    }
    if (data.status === "COMPLETED" && !data.dateCompleted) {
      ctx.addIssue({
        path: ["dateCompleted"],
        message: "Date completed is required when status is Completed",
        code: "custom",
      });
    }
  });

type ApplicationForm = z.infer<typeof applicationSchema>;

type Props = {
  application?: JobApplication;
  onClose: () => void;
  onSave: (data: ApplicationForm) => void;
  isLoading: boolean;
};

export default function ApplicationModal({
  application,
  onClose,
  onSave,
  isLoading,
}: Props) {
  const isEditing = !!application;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  const prevStatusRef = useRef<ApplicationStatus | undefined>(undefined);
  const statusValue = watch("status");

  useEffect(() => {
    if (application) {
      reset({
        company: application.company,
        jobPosition: application.jobPosition,
        jobLink: application.jobLink,
        status: application.status,
        progress: application.progress || undefined,
        interviewDate: application.interviewDate?.split("T")[0] || undefined,
        dateApplied: application.dateApplied?.split("T")[0],
        dateCompleted: application.dateCompleted?.split("T")[0] || undefined,
        hasForm: application.hasForm,
      });
    }
  }, [application, reset]);

  useEffect(() => {
    if (!isEditing) return;

    const prevStatus = prevStatusRef.current;

    // 🚫 Skip first run (modal open)
    if (!prevStatus) {
      prevStatusRef.current = statusValue;
      return;
    }

    // User actually changed status
    if (statusValue !== "IN_PROGRESS") {
      setValue("progress", undefined);
      setValue("interviewDate", undefined);
    }

    if (statusValue !== "COMPLETED") {
      setValue("dateCompleted", undefined);
    }

    prevStatusRef.current = statusValue;
  }, [statusValue, isEditing, setValue]);

  const filteredStatuses = Object.keys(statusLabels).filter((s) => {
    const status = s as ApplicationStatus;
    if (!isEditing) return true;
    if (application.status === "VIEWED") return status !== "APPLIED";
    if (application.status === "IN_PROGRESS")
      return !["APPLIED", "VIEWED"].includes(status);
    if (application.status === "COMPLETED") return status === "COMPLETED";
    return true;
  }) as ApplicationStatus[];

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Update" : "Add"} Application
        </h2>
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-2">
          <label className="text-sm font-medium">Company</label>
          <input {...register("company")} className="mb-2" />
          {errors.company && (
            <span className="text-red-500 text-sm">
              {errors.company.message}
            </span>
          )}

          <label className="text-sm font-medium">Job Position</label>
          <input {...register("jobPosition")} className="mb-2" />
          {errors.jobPosition && (
            <span className="text-red-500 text-sm">
              {errors.jobPosition.message}
            </span>
          )}

          <label className="text-sm font-medium">Job Link</label>
          <input {...register("jobLink")} className="mb-2" />
          {errors.jobLink && (
            <span className="text-red-500 text-sm">
              {errors.jobLink.message}
            </span>
          )}

          <label className="text-sm font-medium">Date Applied</label>
          {isEditing ? (
            <input
              type="text"
              disabled
              value={
                application?.dateApplied
                  ? new Date(application.dateApplied).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : ""
              }
              className="opacity-70 cursor-not-allowed"
            />
          ) : (
            <>
              <input type="date" {...register("dateApplied")} />
              {errors.dateApplied && (
                <span className="text-red-500 text-sm">
                  {errors.dateApplied.message}
                </span>
              )}
            </>
          )}

          {isEditing && (
            <>
              <label className="text-sm font-medium">Status</label>
              <select {...register("status")} className="mb-2">
                {filteredStatuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>

              {statusValue === "IN_PROGRESS" && (
                <>
                  <label className="text-sm font-medium">Progress</label>
                  <select {...register("progress")} className="mb-2">
                    {Object.keys(progressLabels).map((p) => {
                      const progress = p as ApplicationProgress;
                      return (
                        <option key={progress} value={progress}>
                          {progressLabels[progress]}
                        </option>
                      );
                    })}
                  </select>
                  {errors.progress && (
                    <span className="text-red-500 text-sm">
                      {errors.progress.message}
                    </span>
                  )}

                  <label className="text-sm font-medium">Interview Date</label>
                  <input
                    type="date"
                    {...register("interviewDate")}
                    className="mb-2"
                  />
                  {errors.interviewDate && (
                    <span className="text-red-500 text-sm">
                      {errors.interviewDate.message}
                    </span>
                  )}
                </>
              )}
              {statusValue === "COMPLETED" && (
                <>
                  <label className="text-sm font-medium">Date Completed</label>
                  <input
                    type="date"
                    {...register("dateCompleted")}
                    className="mb-2"
                  />
                  {errors.dateCompleted && (
                    <span className="text-red-500 text-sm">
                      {errors.dateCompleted.message}
                    </span>
                  )}
                </>
              )}
              {isEditing && application?.hasForm ? (
                <p className="text-xs text-gray-400 mt-1">
                  This application already has a form attached.
                </p>
              ) : (
                <label className="flex items-center gap-2 mt-2">
                  <span className="text-sm">Has Form</span>
                  <input type="checkbox" {...register("hasForm")} />
                </label>
              )}
            </>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="button-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="button-primary px-4 py-2 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="spinner" />}

              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
