import { createContext, useContext, useState } from "react";
import dayjs from "dayjs";

export interface XOtchet {
  id: string;
  name: string;
  date: string;
  kassir: string;
  startTime: string;
  endTime?: string;
  status: "active" | "paused" | "closed";
}

interface SmenaCtx {
  list: XOtchet[];
  active: XOtchet | null;
  openXOtchet: (kassir: string) => void;
  closeXOtchet: (id: string) => void;
  pauseXOtchet: (id: string) => void;
  resumeXOtchet: (id: string) => void;
  closeAllForZ: () => void;
}

const SmenaContext = createContext<SmenaCtx | null>(null);

export function SmenaProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<XOtchet[]>([]);

  const active = list.find((x) => x.status === "active") ?? null;

  function openXOtchet(kassir: string) {
    const num = list.length + 1;
    const item: XOtchet = {
      id: Date.now().toString(),
      name: `X-Otchet #${num}`,
      date: dayjs().format("DD.MM.YYYY"),
      kassir,
      startTime: dayjs().format("HH:mm:ss"),
      status: "active",
    };
    setList((prev) => [...prev, item]);
  }

  function closeXOtchet(id: string) {
    setList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "closed", endTime: dayjs().format("HH:mm:ss") } : x))
    );
  }

  function pauseXOtchet(id: string) {
    setList((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "paused" } : x))
    );
  }

  function resumeXOtchet(id: string) {
    setList((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, status: "active" }
          : x.status === "active"
          ? { ...x, status: "paused" }
          : x
      )
    );
  }

  function closeAllForZ() {
    const endTime = dayjs().format("HH:mm:ss");
    setList((prev) =>
      prev.map((x) => (x.status !== "closed" ? { ...x, status: "closed", endTime } : x))
    );
  }

  return (
    <SmenaContext.Provider
      value={{ list, active, openXOtchet, closeXOtchet, pauseXOtchet, resumeXOtchet, closeAllForZ }}
    >
      {children}
    </SmenaContext.Provider>
  );
}

export function useSmena() {
  const ctx = useContext(SmenaContext);
  if (!ctx) throw new Error("useSmena must be used within SmenaProvider");
  return ctx;
}
