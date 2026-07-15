import { LuChevronDown } from "react-icons/lu";

interface Props {
  label: string;
  count: number;
  color?: string;
  open: boolean;
  onToggle: () => void;
}

export function AksiyaSectionHeader({
  label,
  count,
  color = "var(--color-blue)",
  open,
  onToggle,
}: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left transition-opacity hover:opacity-70 cursor-pointer"
    >
      <div
        style={{
          width: 3,
          height: 18,
          borderRadius: 9999,
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        className="text-sm font-semibold tracking-wide uppercase"
        style={{ color: "var(--text-default)" }}
      >
        {label}
      </span>
      <span
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: color + "20", color }}
      >
        {count}
      </span>
      <LuChevronDown
        size={16}
        style={{
          color: "var(--text-muted)",
          marginLeft: "auto",
          transition: "transform 200ms",
          transform: open ? "rotate(0deg)" : "rotate(-90deg)",
        }}
      />
    </button>
  );
}
