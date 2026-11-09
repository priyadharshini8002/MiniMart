// context/ToastContext.jsx
// Shows small success / error messages at the top of the screen.
// Any component can call:  const { showToast } = useToast();  showToast("Saved!", "success");

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); // hide after 3.5 seconds
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </ToastContext.Provider>
  );
}
