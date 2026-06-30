import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuTriangleAlert,
  LuChevronDown,
  LuChevronUp,
  LuCalendar,
} from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { UnsentDay } from "../types";

interface Props {
  days: UnsentDay[];
}

export function UnsentDaysAlert({ days }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  if (days.length === 0) return null;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "#f97316", background: "#f9731608" }}
    >
      <button
        className="w-full flex items-center gap-3 px-5 py-3 text-left"
        style={{ background: "transparent" }}
        onClick={() => setOpen((p) => !p)}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#f9731620" }}
        >
          <LuTriangleAlert size={14} style={{ color: "#f97316" }} />
        </div>
        <div className="flex-1">
          <span
            className="text-sm font-semibold"
            style={{ color: "#f97316" }}
          >
            {days.length} kun uchun hisobot buxgalteriyaga yuborilmagan
          </span>
        </div>
        {open ? (
          <LuChevronUp size={15} style={{ color: "#f97316" }} />
        ) : (
          <LuChevronDown size={15} style={{ color: "#f97316" }} />
        )}
      </button>

      {open && (
        <div
          className="border-t px-5 py-3 flex flex-col gap-2"
          style={{ borderColor: "#f9731630" }}
        >
          {days.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <LuCalendar size={13} style={{ color: "#f97316" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-default)" }}
                >
                  {day.date}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  · {day.cashbox_count} ta kassa
                </span>
              </div>
              <CusButton
                size="xs"
                colorPalette="orange"
                variant="outline"
                onClick={() =>
                  navigate(`/rolekassa-main/incoming?date=${day.date}`)
                }
              >
                Ko'rish
              </CusButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
