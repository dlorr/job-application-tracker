import type {
  JobApplication,
  SortColumn,
  SortDirection,
} from "../types/jobApplication";
import { statusLabels, progressLabels } from "../constants/select";
import { getJobLinkLabel } from "../utils/jobLink";
import { statusColors } from "../constants/statusColors";

type Props = {
  applications: JobApplication[];
  isLoading: boolean;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  sortBy: SortColumn;
  sortOrder: SortDirection;
  onSort: (column: SortColumn) => void;
};

export default function ApplicationTable({
  applications,
  isLoading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: Props) {
  // Date formatter
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Position</th>
            <th>Job Link</th>
            <th>Status</th>
            <th>Progress</th>

            <th
              className="cursor-pointer select-none"
              onClick={() => onSort("interviewDate")}
            >
              Interview Schedule{" "}
              {sortBy === "interviewDate" ? (
                sortOrder === "asc" ? (
                  <span>↑</span>
                ) : (
                  <span>↓</span>
                )
              ) : (
                <span className="text-gray-400">⇅</span>
              )}
            </th>

            <th
              className="cursor-pointer select-none"
              onClick={() => onSort("dateCompleted")}
            >
              Date Completed{" "}
              {sortBy === "dateCompleted" ? (
                sortOrder === "asc" ? (
                  <span>↑</span>
                ) : (
                  <span>↓</span>
                )
              ) : (
                <span className="text-gray-400">⇅</span>
              )}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => onSort("dateApplied")}
            >
              Date Applied{" "}
              {sortBy === "dateApplied" ? (
                sortOrder === "asc" ? (
                  <span>↑</span>
                ) : (
                  <span>↓</span>
                )
              ) : (
                <span className="text-gray-400">⇅</span> // sortable indicator when not active
              )}
            </th>
            <th>Has Form</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8}>Loading...</td>
            </tr>
          ) : applications.length === 0 ? (
            <tr>
              <td colSpan={8}>No applications</td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id}>
                <td>{app.company}</td>
                <td>{app.jobPosition}</td>
                <td>
                  <a
                    href={app.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-400"
                  >
                    {getJobLinkLabel(app.jobLink)}
                  </a>
                </td>
                <td className={statusColors[app.status]}>
                  {statusLabels[app.status]}
                </td>
                <td>{app.progress ? progressLabels[app.progress] : "-"}</td>
                <td>
                  {app.interviewDate ? formatDate(app.interviewDate) : "-"}
                </td>
                <td>
                  {app.dateCompleted ? formatDate(app.dateCompleted) : "-"}
                </td>
                <td>{app.dateApplied ? formatDate(app.dateApplied) : "-"}</td>
                <td>{app.hasForm ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  {app.status !== "COMPLETED" && (
                    <span
                      onClick={() => onEdit(app)}
                      className="text-yellow-200 underline cursor-pointer"
                    >
                      Update
                    </span>
                  )}
                  <span
                    onClick={() => onDelete(app)}
                    className="text-red underline cursor-pointer"
                  >
                    Remove
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
