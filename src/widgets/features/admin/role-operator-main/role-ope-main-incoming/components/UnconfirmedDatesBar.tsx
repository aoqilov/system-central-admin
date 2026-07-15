import dayjs from "dayjs";
import { LuTriangleAlert, LuEye, LuArrowLeft } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  dates: string[];
  selectedDate: string;
  todayStr: string;
  onSelect: (date: string) => void;
}

export function UnconfirmedDatesBar({ dates, selectedDate, todayStr, onSelect }: Props) {
  if (dates.length === 0) return null;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "#f97316aa", background: "#f974160a" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "#f97316aa" }}
      >
        <LuTriangleAlert size={15} style={{ color: "#f97316", flexShrink: 0 }} />
        <p className="text-sm font-semibold" style={{ color: "#f97316" }}>
          У вас есть неподтверждённые отчёты
        </p>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: "#f9741620", color: "#f97316" }}
        >
          {dates.length}
        </span>
      </div>

      {/* Date rows */}
      <div className="divide-y" style={{ borderColor: "#f9741630" }}>
        {dates.map((date) => {
          const isActive = selectedDate === date;
          const label = dayjs(date).format("DD.MM.YYYY");
          const dayName = dayjs(date).format("dddd");

          return (
            <div
              key={date}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: isActive ? "#f9741614" : "transparent",
              }}
            >
              <div className="flex-1 flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: isActive ? "#f97316" : "#f9741660" }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
                    {label}
                  </p>
                  <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                    {dayName}
                  </p>
                </div>
              </div>

              {isActive ? (
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ background: "#f9741620", color: "#f97316" }}
                  >
                    Просматривается
                  </span>
                  {selectedDate !== todayStr && (
                    <CusButton
                      size="xs"
                      colorPalette="gray"
                      onClick={() => onSelect(todayStr)}
                    >
                      <LuArrowLeft size={11} /> Сегодня
                    </CusButton>
                  )}
                </div>
              ) : (
                <CusButton
                  size="xs"
                  colorPalette="orange"
                  variant="solid"
                  onClick={() => onSelect(date)}
                >
                  <LuEye size={11} /> Просмотр
                </CusButton>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
