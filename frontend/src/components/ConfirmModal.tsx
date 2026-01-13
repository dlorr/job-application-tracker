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
            className="button-secondary px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="button-delete px-4 py-2 flex items-center justify-center gap-2"
          >
            {isLoading && <span className="spinner" />}
            {isLoading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
