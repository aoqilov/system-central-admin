import { useState, useRef, useCallback } from "react";

export interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
  autoClose: boolean;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const show = useCallback(
    (message: string, type: ToastItem["type"] = "success", autoClose = true) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message, type, autoClose }]);
      if (autoClose) {
        setTimeout(
          () => setToasts((prev) => prev.filter((t) => t.id !== id)),
          1000,
        );
      }
    },
    [],
  );

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, remove };
}
