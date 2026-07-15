import { useState } from "react";
import dayjs from "dayjs";
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "@ark-ui/react/date-picker";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";

function getISOWeek(d: dayjs.Dayjs): number {
  const date = new Date(d.year(), d.month(), d.date());
  const oneJan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
}

export function getWeekStart(from: dayjs.Dayjs = dayjs()): dayjs.Dayjs {
  const day = from.day();
  const diff = day >= 5 ? day - 5 : day + 2;
  return from.subtract(diff, "day").startOf("day");
}

export type TopFilter = 10 | 20 | 50;
const TOP_OPTIONS: TopFilter[] = [10, 20, 50];

export interface DateRange {
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
}

type FilterMode = "week" | "range";

interface Props {
  search: string;
  dateRange: DateRange;
  top: TopFilter;
  onSearchChange: (v: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onTopChange: (top: TopFilter) => void;
}

function toDV(s: string): DateValue[] | undefined {
  try {
    return [parseDate(s)];
  } catch {
    return undefined;
  }
}

const SEGMENT_ITEMS = [
  { id: "week" as FilterMode,  label: "Неделя" },
  { id: "range" as FilterMode, label: "Период" },
];

export function MemoryFilters({
  search,
  dateRange,
  top,
  onSearchChange,
  onDateRangeChange,
  onTopChange,
}: Props) {
  const [mode, setMode] = useState<FilterMode>("week");
  const [weekStart, setWeekStart] = useState<dayjs.Dayjs>(() => getWeekStart());

  const weekNum = getISOWeek(weekStart);

  const handleModeChange = (newMode: string) => {
    const m = newMode as FilterMode;
    setMode(m);
    if (m === "week") {
      onDateRangeChange({
        from: weekStart.format("YYYY-MM-DD"),
        to: weekStart.add(6, "day").format("YYYY-MM-DD"),
      });
    }
  };

  const handleWeekChange = (newStart: dayjs.Dayjs) => {
    setWeekStart(newStart);
    onDateRangeChange({
      from: newStart.format("YYYY-MM-DD"),
      to: newStart.add(6, "day").format("YYYY-MM-DD"),
    });
  };

  const handleFromChange = ({ valueAsString }: { value: DateValue[]; valueAsString: string[] }) => {
    if (valueAsString[0]) onDateRangeChange({ ...dateRange, from: valueAsString[0] });
  };

  const handleToChange = ({ valueAsString }: { value: DateValue[]; valueAsString: string[] }) => {
    if (valueAsString[0]) onDateRangeChange({ ...dateRange, to: valueAsString[0] });
  };

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: "var(--bg-second)", border: "1px solid var(--border-default)" }}
    >
      {/* Row 1: Search + Segment + Date — all in one line */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <LuSearch
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-dim)",
              pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск..."
            style={{
              width: "100%",
              height: 38,
              paddingLeft: 30,
              paddingRight: 8,
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              color: "var(--text-default)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* Segment */}
        <div className="shrink-0">
          <CusSegment
            layout="inline"
            size="sm"
            value={mode}
            onValueChange={handleModeChange}
            items={SEGMENT_ITEMS}
          />
        </div>

        {/* Date control */}
        {mode === "week" ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleWeekChange(weekStart.subtract(7, "day"))}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              <LuChevronLeft size={14} />
            </button>
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border-default)",
                color: "var(--text-default)",
                whiteSpace: "nowrap",
              }}
            >
              {weekNum}-НЕДЕЛЯ
            </div>
            <button
              onClick={() => handleWeekChange(weekStart.add(7, "day"))}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              <LuChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0" style={{ minWidth: 280 }}>
            <CusCalendar
              placeholder="От"
              value={toDV(dateRange.from)}
              onValueChange={handleFromChange}
            />
            <CusCalendar
              placeholder="До"
              value={toDV(dateRange.to)}
              onValueChange={handleToChange}
            />
          </div>
        )}
      </div>

      {/* Row 2: TOP filters */}
      <div className="flex items-center gap-2">
        {TOP_OPTIONS.map((t) => (
          <button
            key={t}
            onClick={() => onTopChange(t)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: top === t ? "#3b82f6" : "var(--bg-hover)",
              border: `1px solid ${top === t ? "#3b82f6" : "var(--border-default)"}`,
              color: top === t ? "#fff" : "var(--text-muted)",
            }}
          >
            ТОП-{t}
          </button>
        ))}
      </div>
    </div>
  );
}
