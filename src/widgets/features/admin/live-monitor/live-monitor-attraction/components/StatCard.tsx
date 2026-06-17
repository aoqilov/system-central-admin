import React from "react";
import { CusCard } from "../../../../../../components/shared/card/CusCard";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}

export function StatCard({ label, value, sub, color, icon: Icon }: StatCardProps) {
  return (
    <CusCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold" style={{ color: "var(--text-default)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </CusCard>
  );
}
