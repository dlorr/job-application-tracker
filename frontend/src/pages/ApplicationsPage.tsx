import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationModal from "../components/ApplicationModal";
import ConfirmModal from "../components/ConfirmModal";
import MessageModal from "../components/MessageModal";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../api/jobApplications";
import type { JobApplication } from "../types/jobApplication";

export default function ApplicationPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["applications", page, pageSize],
    queryFn: () => getApplications(page, pageSize),
  });

  const applications = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const addUpdateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => {
      await new Promise((res) => setTimeout(res, 1000));
      return id ? updateApplication(id, data) : createApplication(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", page] });
      setMessage(selectedApp ? "Updated successfully!" : "Added successfully!");
      setSelectedApp(null);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((res) => setTimeout(res, 1000));
      return deleteApplication(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", page] });
      setMessage("Deleted successfully!");
      setSelectedApp(null);
      setConfirmOpen(false);
    },
  });

  const handleSave = (data: any) =>
    addUpdateMutation.mutate({ id: selectedApp?.id, data });
  const handleDelete = () =>
    selectedApp && deleteMutation.mutate(selectedApp.id);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Job Applications</h1>
      <div className="mb-4 flex items-start justify-between gap-4">
        {/* Page Size Selector */}
        <div className="inline-flex items-center gap-2 w-max">
          <span className="whitespace-nowrap">Page Size:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-1 rounded w-20"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Add Application Button */}
        <button
          onClick={() => {
            setSelectedApp(null);
            setModalOpen(true);
          }}
          className="button-primary px-4 py-2 rounded w-max mb-2"
        >
          Add Application
        </button>
      </div>
      <ApplicationTable
        applications={applications}
        isLoading={isLoading || isFetching}
        onEdit={(app) => {
          setSelectedApp(app);
          setModalOpen(true);
        }}
        onDelete={(app) => {
          setSelectedApp(app);
          setConfirmOpen(true);
        }}
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="button-secondary px-3 py-1 disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="button-primary px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {modalOpen && (
        <ApplicationModal
          application={selectedApp || undefined}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          isLoading={addUpdateMutation.isPending}
        />
      )}
      {confirmOpen && (
        <ConfirmModal
          message={`Delete ${selectedApp?.company}?`}
          onConfirm={handleDelete}
          onClose={() => setConfirmOpen(false)}
          isLoading={deleteMutation.isPending}
        />
      )}
      {message && (
        <MessageModal message={message} onClose={() => setMessage("")} />
      )}
    </div>
  );
}
