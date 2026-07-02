import type { ElementType, ReactNode } from "react";

interface SettingRowProps {
  icon: ElementType;
  iconColor: string;
  label: string;
  description: string;
  right: ReactNode;
}

export function SettingRow({ icon: Icon, iconColor, label, description, right }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}
