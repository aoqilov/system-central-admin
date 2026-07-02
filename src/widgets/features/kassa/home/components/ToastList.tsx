import { useEffect, useRef, useState } from "react";
import { LuCircleCheck, LuCircleX, LuX } from "react-icons/lu";
import type { ToastItem } from "../hooks/useToast";

interface Props {
  items: ToastItem[];
  onRemove: (id: number) => void;
}

export function ToastList({ items, onRemove }: Props) {
  const toast = items[items.length - 1] ?? null;
  if (!toast) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="relative rounded-2xl border flex flex-col items-center gap-5 px-8 py-8 w-full"
          style={{
            maxWidth: 360,
            background: "var(--bg-second)",
            borderColor: toast.type === "success" ? "#22c55e50" : "#ef444450",
            boxShadow: "0 25px 50px rgba(0,0,0,0.45)",
            animation: "toastIn 0.18s cubic-bezier(.2,.8,.4,1)",
          }}
        >
          <button
            onClick={() => onRemove(toast.id)}
            className="absolute top-3.5 right-3.5 flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)", background: "var(--bg-hover)" }}
          >
            <LuX size={14} />
          </button>

          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background: toast.type === "success" ? "#22c55e18" : "#ef444418",
            }}
          >
            {toast.type === "success" ? (
              <LuCircleCheck size={40} style={{ color: "#22c55e" }} />
            ) : (
              <LuCircleX size={40} style={{ color: "#ef4444" }} />
            )}
          </div>

          <p
            className="text-base font-semibold text-center leading-snug"
            style={{ color: "var(--text-default)" }}
          >
            {toast.message}
          </p>

          {toast.autoClose ? (
            <ProgressBar key={toast.id} type={toast.type} duration={1000} />
          ) : (
            <button
              onClick={() => onRemove(toast.id)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
              style={{
                background: toast.type === "success" ? "#22c55e20" : "#ef444420",
                color: toast.type === "success" ? "#4ade80" : "#f87171",
                border: `1px solid ${toast.type === "success" ? "#22c55e40" : "#ef444440"}`,
              }}
            >
              Yopish
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

function ProgressBar({ type, duration }: { type: "success" | "error"; duration: number }) {
  const [width, setWidth] = useState(100);
  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    function tick() {
      const pct = Math.max(0, 100 - ((Date.now() - startRef.current) / duration) * 100);
      setWidth(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration]);

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: 3, background: "var(--bg-hover)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: type === "success" ? "#22c55e" : "#ef4444",
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
}
