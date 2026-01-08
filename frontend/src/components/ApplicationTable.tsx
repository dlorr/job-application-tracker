import type { JobApplication } from "../types/jobApplication";
import { statusLabels, progressLabels } from "../constants/select";

type Props = {
  applications: JobApplication[];
  isLoading: boolean;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
};

export default function ApplicationTable({
  applications,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  // Date formatter
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
            <th>Interview Date</th>
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
                  <a href={app.jobLink} target="_blank" className="underline">
                    {app.jobLink}
                  </a>
                </td>
                <td>{statusLabels[app.status]}</td>
                <td>{app.progress ? progressLabels[app.progress] : "-"}</td>
                <td>
                  {app.interviewDate ? formatDate(app.interviewDate) : "-"}
                </td>
                <td>{app.hasForm ? "Yes" : "No"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => onEdit(app)}
                    className="bg-yellow-500 px-2 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    className="bg-red-600 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
