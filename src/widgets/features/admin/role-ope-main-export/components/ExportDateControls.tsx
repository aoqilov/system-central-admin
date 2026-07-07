import dayjs, { type Dayjs } from "dayjs";
import { LuDownload, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { parseDate } from "@internationalized/date";
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
  tab,
  onTabChange,
  selectedDay,
  onDayChange,
  dateFrom,
  dateTo,
  onFromChange,
  onToChange,
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDayChange(selectedDay.subtract(1, "day"))}
            className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--border-default)",
            }}
          >
            <LuChevronLeft size={15} />
          </button>
          <div style={{ width: 150 }}>
            <CusCalendar
              placeholder="Сана"
              value={[parseDate(selectedDay.format("YYYY-MM-DD"))]}
              onValueChange={({ value }) => {
                if (value[0]) onDayChange(dayjs(value[0].toString()));
              }}
            />
          </div>
          <button
            onClick={() => onDayChange(selectedDay.add(1, "day"))}
            className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--border-default)",
            }}
          >
            <LuChevronRight size={15} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div style={{ width: 150 }}>
            <CusCalendar
              placeholder="С"
              value={dateFrom}
              onValueChange={onFromChange}
            />
          </div>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            —
          </span>
          <div style={{ width: 150 }}>
            <CusCalendar
              placeholder="По"
              value={dateTo}
              min={dateFrom[0]}
              onValueChange={onToChange}
            />
          </div>
        </div>
      )}

      <CusButton
        size="sm"
        onClick={onExport}
        colorPalette="green"
        variant="solid"
      >
        <LuDownload size={14} /> Скачать Excel
      </CusButton>
    </div>
  );
}
