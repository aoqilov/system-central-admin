import type { ElementType } from "react";

interface Props {
  icon: ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}

export function IncomingStatCard({ icon: Icon, label, value, sub, color }: Props) {
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-2 shrink-0"
      style={{
        background: "var(--bg-main)",
        borderColor: "var(--border-default)",
        minWidth: 176,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p
        className="font-bold leading-none"
        style={{ fontSize: 22, color: "var(--text-default)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
