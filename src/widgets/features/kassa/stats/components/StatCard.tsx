export function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  dim,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  dim?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-2 flex-shrink-0 transition-opacity"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        opacity: dim ? 0.5 : 1,
        minWidth: 158,
      }}
    >
      <div className="flex flex-col items-center justify-between gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
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
    </div>
  );
}
