type Props = {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean; // ✅ Add this prop
};

export default function ConfirmModal({
  message,
  onConfirm,
  onClose,
  isLoading,
}: Props) {
  return (
    <div className="modal-overlay" onClick={() => !isLoading && onClose()}>
      <div className="modal relative" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-500 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
