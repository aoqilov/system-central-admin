import type React from "react";

export function QrInfoRow({
  icon: Icon,
  label,
  value,
  align = "left",
  bg,
  large,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  align?: "left" | "right";
  bg?: string;
  large?: boolean;
  suffix?: string;
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
        className={`rounded-lg px-3 flex items-center gap-1.5 ${large ? "h-9 text-2xl" : "h-7 text-lg"} ${align === "right" ? "justify-end" : ""}`}
        style={{
          background: bg ?? "var(--bg-hover)",
          color: value ? "var(--text-default)" : "var(--text-dim)",
          border: `1px solid ${bg ? "#22c55e40" : "var(--border-default)"}`,
        }}
      >
        <span className="font-mono ">{value || "—"}</span>
        {suffix && (
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
