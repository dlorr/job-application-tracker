export default function MessageModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="button-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
