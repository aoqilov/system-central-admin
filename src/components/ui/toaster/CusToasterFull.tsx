import { useEffect, useRef, useState, useCallback } from "react";
import { LuCircleCheck, LuCircleX, LuX } from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToasterItem {
  id: number;
  message: string;
  type: "success" | "error";
  autoClose: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToasterFull() {
  const [items, setItems] = useState<ToasterItem[]>([]);
  const counter = useRef(0);

  const show = useCallback(
    (
      message: string,
      type: ToasterItem["type"] = "success",
      autoClose = true,
    ) => {
      const id = ++counter.current;
      setItems((prev) => [...prev, { id, message, type, autoClose }]);
      if (autoClose) {
        setTimeout(
          () => setItems((prev) => prev.filter((t) => t.id !== id)),
          1000,
        );
      }
    },
    [],
  );

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { items, show, remove };
}

// ─── UI ───────────────────────────────────────────────────────────────────────

interface Props {
  items: ToasterItem[];
  onRemove: (id: number) => void;
}

export function CusToasterFull({ items, onRemove }: Props) {
  const toast = items[items.length - 1] ?? null;
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const accent = isSuccess ? "#22c55e" : "#ef4444";

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
            borderColor: `${accent}50`,
            boxShadow: "0 25px 50px rgba(0,0,0,0.45)",
            animation: "cusToastIn 0.18s cubic-bezier(.2,.8,.4,1)",
          }}
        >
          {/* X — yuqori o'ng */}
          <button
            onClick={() => onRemove(toast.id)}
            className="absolute top-3.5 right-3.5 flex items-center justify-center w-7 h-7 rounded-lg"
            style={{
              color: "var(--text-muted)",
              background: "var(--bg-hover)",
            }}
          >
            <LuX size={14} />
          </button>

          {/* Icon */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: `${accent}18` }}
          >
            {isSuccess ? (
              <LuCircleCheck size={40} style={{ color: accent }} />
            ) : (
              <LuCircleX size={40} style={{ color: accent }} />
            )}
          </div>

          {/* Message */}
          <p
            className="text-base font-semibold text-center leading-snug"
            style={{ color: "var(--text-default)" }}
          >
            {toast.message}
          </p>

          {/* autoClose → progress bar | manual →  button */}
          {toast.autoClose ? (
            <ProgressBar key={toast.id} accent={accent} duration={1000} />
          ) : (
            <button
              onClick={() => onRemove(toast.id)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
              style={{
                background: `${accent}20`,
                color: isSuccess ? "#4ade80" : "#f87171",
                border: `1px solid ${accent}40`,
              }}
            >
              Закрыть
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cusToastIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  accent,
  duration,
}: {
  accent: string;
  duration: number;
}) {
  const [width, setWidth] = useState(100);
  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    function tick() {
      const pct = Math.max(
        0,
        100 - ((Date.now() - startRef.current) / duration) * 100,
      );
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
          background: accent,
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
}
