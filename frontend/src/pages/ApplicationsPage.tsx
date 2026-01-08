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

const PAGE_SIZE = 5;

export default function ApplicationPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications", page],
    queryFn: () => getApplications(page, PAGE_SIZE),
    staleTime: 0, // always treat data as stale
    refetchOnMount: "always", // refetch when component mounts
    initialData: () =>
      queryClient.getQueryData(["applications", page - 1]) || [],
  });

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
      <h1 className="text-3xl font-bold mb-4 text-white">Job Applications</h1>
      <button
        onClick={() => {
          setSelectedApp(null);
          setModalOpen(true);
        }}
        className="bg-primary px-4 py-2 rounded mb-4"
      >
        Add Application
      </button>

      <ApplicationTable
        applications={applications}
        isLoading={isLoading}
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
      <div className="mt-4 flex justify-between">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={applications.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
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
