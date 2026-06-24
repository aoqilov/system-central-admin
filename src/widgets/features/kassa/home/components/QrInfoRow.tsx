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
    <div className="flex flex-col gap-1">
      <p
        className="text-[11px] font-medium uppercase tracking-wide flex items-center gap-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        <Icon size={11} />
        {label}
      </p>
      <div
        className="h-8 rounded-lg px-3 flex items-center text-sm font-mono"
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
