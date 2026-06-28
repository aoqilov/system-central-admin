import type React from "react";

export function QrInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p
        className="text-[10px] font-medium uppercase tracking-wide flex items-center gap-1"
        style={{ color: "var(--text-muted)" }}
      >
        <Icon size={10} />
        {label}
      </p>
      <div
        className="h-7 rounded-lg px-3 flex items-center text-xs font-mono"
        style={{
          background: "var(--bg-hover)",
          color: value ? "var(--text-default)" : "var(--text-dim)",
          border: "1px solid var(--border-default)",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}
