import type React from "react";

// ─── Card ─────────────────────────────────────────────────────────────────────

export function CusCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

export function CusCardHeader({
  icon: Icon,
  title,
  iconColor,
  action,
}: {
  icon: React.ElementType;
  title: string;
  iconColor?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-5 py-3.5 border-b"
      style={{ borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: iconColor ?? "var(--text-muted)" }} />
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {title}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

export function CusInfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={last ? {} : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-hover)" }}
      >
        <Icon size={13} style={{ color: "var(--text-muted)" }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        {typeof value === "string" ? (
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--text-default)" }}
          >
            {value}
          </p>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

