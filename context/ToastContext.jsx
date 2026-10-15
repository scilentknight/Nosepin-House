"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
const ToastContext = createContext(null);
const VARIANT_STYLES = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-gray-200 bg-white text-gray-800",
};
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const counter = useRef(0);
    const showToast = useCallback((message, variant = "success") => {
        const id = ++counter.current;
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);
    function dismiss(id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }
    return (<ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:left-auto sm:right-4 sm:items-end">
        {toasts.map((t) => (<div key={t.id} role="status" className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${VARIANT_STYLES[t.variant]}`}>
            <p className="flex-1">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100" aria-label="Dismiss">
              ×
            </button>
          </div>))}
      </div>
    </ToastContext.Provider>);
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
