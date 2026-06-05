import { DatePicker } from "@chakra-ui/react";
import type { DateValue } from "@ark-ui/react/date-picker";

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectionMode  = "single" | "multiple" | "range";
type DateView       = "day" | "month" | "year";
type CalendarSize   = "xs" | "sm" | "md" | "lg" | "xl";
type ColorPalette   =
  | "blue" | "green" | "red" | "orange" | "purple"
  | "yellow" | "cyan" | "teal" | "pink" | "gray";

export interface CusCalendarProps {
  /** Accent color of selected dates, today indicator, etc. */
  colorPalette?: ColorPalette;
  // ── Value control ──────────────────────────────────────────────────────────
  /** Controlled selected date(s). Always an array — single: [date], range: [from, to], multiple: [...dates] */
  value?: DateValue[];
  /** Initial selected date(s) for uncontrolled usage */
  defaultValue?: DateValue[];
  /** Fires when selection changes */
  onValueChange?: (details: { value: DateValue[]; valueAsString: string[] }) => void;

  // ── Selection behavior ─────────────────────────────────────────────────────
  /** "single" (default) | "range" | "multiple" */
  selectionMode?: SelectionMode;
  /** Max selectable dates when selectionMode="multiple" */
  maxSelectedDates?: number;

  // ── Date restrictions ──────────────────────────────────────────────────────
  /** Earliest selectable date */
  min?: DateValue;
  /** Latest selectable date */
  max?: DateValue;
  /** Custom function to mark specific dates as unavailable */
  isDateUnavailable?: (date: DateValue, locale: string) => boolean;
  /** Allow clicking on days outside current month (outsideDaySelectable) */
  outsideDaySelectable?: boolean;

  // ── Display ────────────────────────────────────────────────────────────────
  /** "xs" | "sm" | "md" (default) | "lg" | "xl" */
  size?: CalendarSize;
  /** Number of months to show side-by-side */
  numOfMonths?: number;
  /** Show ISO week numbers column */
  showWeekNumbers?: boolean;

  // ── Navigation ─────────────────────────────────────────────────────────────
  /** Initial view: "day" (default) | "month" | "year" */
  defaultView?: DateView;
  /** Minimum zoom-out level (e.g. "month" prevents reaching year view) */
  minView?: DateView;
  /** Maximum zoom-out level */
  maxView?: DateView;

  // ── Localization ───────────────────────────────────────────────────────────
  /** BCP 47 locale tag, e.g. "uz-UZ" | "ru-RU" | "en-US" (default) */
  locale?: string;
  /** IANA timezone string, e.g. "Asia/Tashkent" */
  timeZone?: string;

  // ── State ──────────────────────────────────────────────────────────────────
  disabled?: boolean;
  readOnly?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CusCalendar({
  colorPalette = "blue",
  value,
  defaultValue,
  onValueChange,
  selectionMode = "single",
  maxSelectedDates,
  min,
  max,
  isDateUnavailable,
  outsideDaySelectable,
  size = "md",
  numOfMonths = 1,
  showWeekNumbers,
  defaultView,
  minView,
  maxView,
  locale,
  timeZone,
  disabled,
  readOnly,
}: CusCalendarProps) {
  return (
    <DatePicker.Root
      inline
      open
      colorPalette={colorPalette}
      // value / selection
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      selectionMode={selectionMode}
      maxSelectedDates={maxSelectedDates}
      // date bounds
      min={min}
      max={max}
      isDateUnavailable={isDateUnavailable}
      outsideDaySelectable={outsideDaySelectable}
      // display
      size={size}
      numOfMonths={numOfMonths}
      showWeekNumbers={showWeekNumbers}
      // navigation
      defaultView={defaultView}
      minView={minView}
      maxView={maxView}
      // locale
      locale={locale}
      timeZone={timeZone}
      // state
      disabled={disabled}
      readOnly={readOnly}
    >
      {/* Day view */}
      <DatePicker.View view="day">
        {numOfMonths > 1 ? (
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {Array.from({ length: numOfMonths }, (_, i) => (
              <div key={i}>
                <DatePicker.Header offset={i} />
                <DatePicker.DayTable offset={i} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <DatePicker.Header />
            <DatePicker.DayTable />
          </>
        )}
      </DatePicker.View>

      {/* Month view */}
      <DatePicker.View view="month">
        <DatePicker.Header />
        <DatePicker.MonthTable />
      </DatePicker.View>

      {/* Year view */}
      <DatePicker.View view="year">
        <DatePicker.Header />
        <DatePicker.YearTable />
      </DatePicker.View>
    </DatePicker.Root>
  );
}
