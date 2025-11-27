import { useState, useEffect } from "react";

export type ToastType = "success" | "info" | "error";

interface ToastState {
  msg: string;
  tone: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (msg: string, tone: ToastType = "info") => {
    setToast({ msg, tone });
  };

  return { toast, showToast };
}
