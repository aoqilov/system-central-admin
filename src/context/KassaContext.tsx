import { createContext, useContext, useState, type ReactNode } from "react";
import dayjs from "dayjs";

export interface SmenaInfo {
  id: number;
  name: string;
  date: string;
  kassir: string;
  startTime: string;
}

interface KassaContextValue {
  smena: SmenaInfo | null;
  nextSmenaNum: number;
  openSmena: (kassir: string, time: string) => void;
  closeSmena: () => void;
}

const KassaContext = createContext<KassaContextValue | null>(null);

export function KassaProvider({ children }: { children: ReactNode }) {
  const [lastNum, setLastNum] = useState(4);
  const [smena, setSmena] = useState<SmenaInfo | null>(null);

  function openSmena(kassir: string, time: string) {
    const num = lastNum + 1;
    setLastNum(num);
    setSmena({
      id: num,
      name: `Smena #${num}`,
      date: dayjs().format("DD.MM.YYYY"),
      kassir,
      startTime: time,
    });
  }

  function closeSmena() {
    setSmena(null);
  }

  return (
    <KassaContext.Provider value={{ smena, nextSmenaNum: lastNum + 1, openSmena, closeSmena }}>
      {children}
    </KassaContext.Provider>
  );
}

export function useKassa() {
  const ctx = useContext(KassaContext);
  if (!ctx) throw new Error("useKassa must be used within KassaProvider");
  return ctx;
}
