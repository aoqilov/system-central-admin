import { useEffect, useState } from "react";

interface Props {
  terminalName: string;
  cashierName: string;
}

export function TopBar({ terminalName, cashierName }: Props) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  return (
    <div
      className="flex items-center shrink-0 px-4 gap-4"
      style={{
        height: 56,
        background: "#0e1521",
        borderBottom: "1px solid #1c2532",
        zIndex: 10,
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-lg font-bold text-xs"
          style={{ width: 28, height: 28, background: "#1f74d6", color: "#fff" }}
        >
          P
        </div>
        <span className="font-bold text-base" style={{ color: "#e8edf5" }}>
          {terminalName}
        </span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <span
          className="rounded-full"
          style={{ width: 8, height: 8, background: "#2ea36b" }}
        />
        <span className="text-xs font-semibold" style={{ color: "#2ea36b" }}>
          Live
        </span>
      </div>

      <div className="flex-1" />

      <span className="text-sm" style={{ color: "#7a8ba6" }}>
        {cashierName}
      </span>

      <span
        className="text-xl font-bold"
        style={{
          color: "#e8edf5",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.05em",
          minWidth: 90,
          textAlign: "right",
        }}
      >
        {hh}:{mm}:{ss}
      </span>
    </div>
  );
}
