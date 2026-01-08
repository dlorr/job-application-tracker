import { useEffect } from "react";
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
    jobLink: z.string().min(1, "Job Link is required").max(500),
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
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

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
        hasForm: application.hasForm,
      });
    }
  }, [application, reset]);

  useEffect(() => {
    if (statusValue !== "IN_PROGRESS") {
      // Clear progress and interviewDate when status is NOT IN_PROGRESS
      reset(
        {
          ...watch(), // keep other form values
          progress: undefined,
          interviewDate: undefined,
        },
        { keepErrors: true, keepDirty: true } // keep other errors/dirty state
      );
    }
  }, [statusValue, reset, watch]);

  const filteredStatuses = Object.keys(statusLabels).filter((s) => {
    const status = s as ApplicationStatus;
    if (!isEditing) return true;
    if (statusValue === "VIEWED") return status !== "APPLIED";
    if (statusValue === "IN_PROGRESS")
      return !["APPLIED", "VIEWED"].includes(status);
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
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
          <input
            {...register("company")}
            placeholder="Company"
            className="mb-2"
          />
          {errors.company && (
            <span className="text-red-500">{errors.company.message}</span>
          )}

          <input
            {...register("jobPosition")}
            placeholder="Job Position"
            className="mb-2"
          />
          {errors.jobPosition && (
            <span className="text-red-500">{errors.jobPosition.message}</span>
          )}

          <input
            {...register("jobLink")}
            placeholder="Job Link"
            className="mb-2"
          />
          {errors.jobLink && (
            <span className="text-red-500">{errors.jobLink.message}</span>
          )}

          {isEditing && (
            <>
              <select {...register("status")} className="mb-2">
                {filteredStatuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>

              {statusValue === "IN_PROGRESS" && (
                <>
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
                    <span className="text-red-500">
                      {errors.progress.message}
                    </span>
                  )}

                  <input
                    type="date"
                    {...register("interviewDate")}
                    className="mb-2"
                  />
                  {errors.interviewDate && (
                    <span className="text-red-500">
                      {errors.interviewDate.message}
                    </span>
                  )}
                </>
              )}
              <label className="flex items-center space-x-2 mb-2">
                <input type="checkbox" {...register("hasForm")} />
                <span>Has Form</span>
              </label>
            </>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-500 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-4 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}

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
