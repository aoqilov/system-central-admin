import type { ReactNode } from "react";

export interface BarListItem {
  label: string;
  value: number;
  color?: string;       // bar rangi, yo'q bo'lsa default palette
  icon?: ReactNode;     // label oldiga icon
  href?: string;        // label link bo'lsa
  description?: string; // label ostiga kichik matn
}

interface BarListChartProps {
  data: BarListItem[];
  valueFormatter?: (value: number) => string;
  sort?: "asc" | "desc" | "none";
  showAnimation?: boolean;
  animationDuration?: number;       // ms
  showValues?: boolean;
  barHeight?: number | string;      // px yoki string
  barRadius?: number | string;
  gap?: number;
  labelWidth?: number | string;     // label ustun kengligi
  onValueChange?: (item: BarListItem) => void;
  emptyText?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
  "#ef4444",
  "#6b7280",
];

function sortData(data: BarListItem[], sort: "asc" | "desc" | "none") {
  if (sort === "none") return data;
  return [...data].sort((a, b) =>
    sort === "desc" ? b.value - a.value : a.value - b.value,
  );
}

export function BarListChart({
  data,
  valueFormatter = (v) => v.toLocaleString(),
  sort = "desc",
  showAnimation = true,
  animationDuration = 600,
  showValues = true,
  barHeight = 36,
  barRadius = 6,
  gap = 8,
  labelWidth = "40%",
  onValueChange,
  emptyText = "Ma'lumot yo'q",
  className,
}: BarListChartProps) {
  const sorted = sortData(data, sort);
  const max = Math.max(...sorted.map((d) => d.value), 1);

  if (!sorted.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 0",
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap }}
    >
      {sorted.map((item, i) => {
        const pct = (item.value / max) * 100;
        const color = item.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const isClickable = !!onValueChange || !!item.href;

        const labelNode = (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              minWidth: 0,
            }}
          >
            {item.icon && (
              <span
                style={{
                  display: "inline-flex",
                  flexShrink: 0,
                  color: "var(--text-muted)",
                  fontSize: 14,
                }}
              >
                {item.icon}
              </span>
            )}
            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: isClickable ? color : "var(--text-2)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textDecoration: item.href ? "underline" : "none",
                  textUnderlineOffset: 2,
                }}
              >
                {item.label}
              </span>
              {item.description && (
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.description}
                </span>
              )}
            </span>
          </span>
        );

        return (
          <div
            key={`${item.label}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => onValueChange?.(item)}
          >
            {/* Label */}
            <div
              style={{
                width: labelWidth,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {labelNode}
                </a>
              ) : (
                labelNode
              )}
            </div>

            {/* Bar track */}
            <div
              style={{
                flex: 1,
                height: barHeight,
                background: "var(--bg-hover)",
                borderRadius: barRadius,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: color,
                  borderRadius: barRadius,
                  opacity: 0.85,
                  transition: showAnimation
                    ? `width ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
                    : "none",
                }}
              />
            </div>

            {/* Value */}
            {showValues && (
              <div
                style={{
                  flexShrink: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-default)",
                  minWidth: 40,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {valueFormatter(item.value)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Usage:
// <BarListChart
//   data={[
//     { label: "1-kassa",   value: 4200, color: "#3b82f6", icon: <LuBanknote /> },
//     { label: "2-kassa",   value: 3100, icon: <LuBanknote /> },
//     { label: "3-kassa",   value: 1800, description: "Ta'mirlashda" },
//   ]}
//   valueFormatter={(v) => `${v.toLocaleString()} UZS`}
//   sort="desc"
//   barHeight={40}
//   labelWidth="35%"
//   onValueChange={(item) => console.log(item)}
// />
