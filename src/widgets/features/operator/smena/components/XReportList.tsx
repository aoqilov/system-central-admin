import type { AttractionReport } from "../types";
import { XReportCard } from "./XReportCard";

interface Props {
  xreports: AttractionReport[];
  onStop: (id: number) => void;
  onResume: (id: number) => void;
  onClose: (id: number) => void;
}

export function XReportList({ xreports, onStop, onResume, onClose }: Props) {
  if (xreports.length === 0) {
    return (
      <div
        className="rounded-2xl border px-5 py-8 text-center"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          X-otchetlar mavjud emas
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {xreports.map((xreport, i) => (
        <XReportCard
          key={xreport.id}
          xreport={xreport}
          index={i + 1}
          onStop={onStop}
          onResume={onResume}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
