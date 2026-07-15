import dayjs from "dayjs";
import { LuChevronLeft, LuChevronRight, LuRotateCcw } from "react-icons/lu";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@ark-ui/react/date-picker";

function strToCalDate(s: string): CalendarDate {
  const [y, m, d] = s.split("-").map(Number);
  return new CalendarDate(y, m, d);
}

function calDateToStr(v: DateValue): string {
  return `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`;
}

interface Props {
  mode: "kunlik" | "oraliq";
  date: string;
  dateFrom: string;
  dateTo: string;
  onModeChange: (m: "kunlik" | "oraliq") => void;
  onDateChange: (d: string) => void;
  onDateFromChange: (d: string) => void;
  onDateToChange: (d: string) => void;
}

export function ExportDatePicker({
  mode,
  date,
  dateFrom,
  dateTo,
  onModeChange,
  onDateChange,
  onDateFromChange,
  onDateToChange,
}: Props) {
  const todayStr = dayjs().format("YYYY-MM-DD");
  const today = strToCalDate(todayStr);
  const isDateToday = date >= todayStr;

  function handleClear() {
    onDateFromChange(dayjs().subtract(2, "day").format("YYYY-MM-DD"));
    onDateToChange(todayStr);
  }

  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap">
      <CusSegment
        layout="inline"
        size="sm"
        items={[
          { id: "kunlik", label: "Ежедневно" },
          { id: "oraliq", label: "Период" },
        ]}
        value={mode}
        onValueChange={(v) => onModeChange(v as "kunlik" | "oraliq")}
      />

      {mode === "kunlik" ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onDateChange(dayjs(date).subtract(1, "day").format("YYYY-MM-DD"))
            }
            className="flex items-center justify-center w-8 h-9 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-default)" }}
          >
            <LuChevronLeft size={15} />
          </button>
          <div style={{ width: 150 }}>
            <CusCalendar
              selectionMode="single"
              placeholder="Дата"
              value={[strToCalDate(date)]}
              onValueChange={({ value }) => {
                if (value[0]) onDateChange(calDateToStr(value[0]));
              }}
              max={today}
            />
          </div>
          <button
            disabled={isDateToday}
            onClick={() =>
              onDateChange(dayjs(date).add(1, "day").format("YYYY-MM-DD"))
            }
            className="flex items-center justify-center w-8 h-9 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-default)" }}
          >
            <LuChevronRight size={15} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div style={{ width: 150 }}>
            <CusCalendar
              selectionMode="single"
              placeholder="С"
              value={[strToCalDate(dateFrom)]}
              onValueChange={({ value }) => {
                if (value[0]) onDateFromChange(calDateToStr(value[0]));
              }}
              max={dateTo < todayStr ? strToCalDate(dateTo) : today}
            />
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>→</span>
          <div style={{ width: 150 }}>
            <CusCalendar
              selectionMode="single"
              placeholder="По"
              value={[strToCalDate(dateTo)]}
              onValueChange={({ value }) => {
                if (value[0]) onDateToChange(calDateToStr(value[0]));
              }}
              min={strToCalDate(dateFrom)}
              max={today}
            />
          </div>
          <button
            onClick={handleClear}
            className="flex items-center justify-center w-8 h-9 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-default)", flexShrink: 0 }}
            title="Последние 3 дня"
          >
            <LuRotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
