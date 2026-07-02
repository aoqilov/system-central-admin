import dayjs, { type Dayjs } from "dayjs";
import { LuDownload, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { DateValue } from "@ark-ui/react/date-picker";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  tab: string;
  onTabChange: (v: string) => void;
  selectedDay: Dayjs;
  onDayChange: (d: Dayjs) => void;
  dateFrom: DateValue[];
  dateTo: DateValue[];
  onFromChange: (e: { value: DateValue[] }) => void;
  onToChange: (e: { value: DateValue[] }) => void;
  onExport: () => void;
}

export function ExportDateControls({
  tab, onTabChange,
  selectedDay, onDayChange,
  dateFrom, dateTo, onFromChange, onToChange,
  onExport,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 shrink-0">
      <CusSegment
        layout="inline"
        size="sm"
        value={tab}
        onValueChange={onTabChange}
        items={[
          { id: "daily", label: "Ежедневно" },
          { id: "range", label: "Период" },
        ]}
      />

      {tab === "daily" ? (
        <div
          className="flex items-center rounded-lg border overflow-hidden"
          style={{ background: "var(--bg-hover)", borderColor: "var(--border-default)" }}
        >
          <button
            onClick={() => onDayChange(selectedDay.subtract(1, "day"))}
            className="flex items-center justify-center px-2.5 h-9 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)", borderRight: "1px solid var(--border-default)" }}
          >
            <LuChevronLeft size={15} />
          </button>
          <span
            className="text-sm font-semibold px-3"
            style={{ color: "var(--text-default)", minWidth: 96, textAlign: "center" }}
          >
            {selectedDay.format("DD.MM.YYYY")}
          </span>
          <button
            onClick={() => onDayChange(selectedDay.add(1, "day"))}
            className="flex items-center justify-center px-2.5 h-9 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)", borderLeft: "1px solid var(--border-default)" }}
          >
            <LuChevronRight size={15} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div style={{ width: 150 }}>
            <CusCalendar placeholder="С" value={dateFrom} onValueChange={onFromChange} />
          </div>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>—</span>
          <div style={{ width: 150 }}>
            <CusCalendar placeholder="По" value={dateTo} min={dateFrom[0]} onValueChange={onToChange} />
          </div>
        </div>
      )}

      <CusButton size="sm" onClick={onExport}>
        <LuDownload size={14} /> Скачать Excel
      </CusButton>
    </div>
  );
}
