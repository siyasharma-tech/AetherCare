// Context API example #2: a tiny global "toast" (pop-up message) service.
// Any component can call showToast("Saved!") without passing props down.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext(null);

const DURATION = 4500; // ms before a toast disappears on its own

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // type is "success" | "error" | "info"
  const showToast = useCallback(
    (message, type = "success") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current.set(id, setTimeout(() => dismiss(id), DURATION));
    },
    [dismiss]
  );

  // Clear any pending timers if the provider is ever removed.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.type}`} key={toast.id}>
            <span className="toast-icon" aria-hidden="true">
              {toast.type === "error" ? "!" : toast.type === "info" ? "i" : "✓"}
            </span>
            <p>{toast.message}</p>
            <button type="button" aria-label="Dismiss message" onClick={() => dismiss(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
