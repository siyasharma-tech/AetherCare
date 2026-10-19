// "Are you sure?" pop-up for actions that can't easily be undone.
// The parent keeps the local state (which item is pending) and decides when it is open.
import { useEffect, useRef } from "react";

function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Keep it", danger = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  // Escape closes the dialog; the safe button gets focus when it opens.
  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <section
        className="modal confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button type="button" className="outline-btn" ref={cancelRef} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={danger ? "danger-solid-btn" : "primary-btn"} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
