"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2",
        type === "success" && "bg-green-50 text-green-900 border border-green-200",
        type === "error" && "bg-red-50 text-red-900 border border-red-200",
        type === "info" && "bg-blue-50 text-blue-900 border border-blue-200"
      )}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">
        ×
      </button>
    </div>
  );
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}

export function useToast() {
  const [toast, setToast] = React.useState<ToastState | null>(null);

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToast({ message, type, id: Date.now() });
    },
    []
  );

  const hideToast = React.useCallback(() => setToast(null), []);

  const ToastComponent = toast ? (
    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
}
