import { LuCircleCheck, LuX } from "react-icons/lu";
import type { ToastItem } from "../hooks/useToast";

export function ToastList({
  items,
  onRemove,
}: {
  items: ToastItem[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ minWidth: 280 }}>
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
          style={{
            background: t.type === "success" ? "#166534" : "#7f1d1d",
            border: `1px solid ${t.type === "success" ? "#22c55e40" : "#ef444440"}`,
            color: "#fff",
            animation: "slideIn 0.2s ease",
          }}
        >
          {t.type === "success" ? (
            <LuCircleCheck size={16} style={{ color: "#4ade80", flexShrink: 0 }} />
          ) : (
            <LuX size={16} style={{ color: "#f87171", flexShrink: 0 }} />
          )}
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button onClick={() => onRemove(t.id)} style={{ color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>
            <LuX size={14} />
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }`}</style>
    </div>
  );
}
