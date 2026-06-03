import React from "react";
import { LuBanknote, LuFerrisWheel, LuUsers } from "react-icons/lu";
import { CusSegment } from "../components/ui/segment/CusSegment";
import LiveMonitorKassa from "./LiveMonitorKassa";
import LiveMonitorAttraction from "./LiveMonitorAttraction";
import LiveMonitorEmployes from "./LiveMonitorEmployes";

const items = [
  { id: "kassa", label: "Kassa", icon: <LuBanknote /> },
  { id: "attraction", label: "Attraksion", icon: <LuFerrisWheel /> },
  { id: "employees", label: "Xodimlar", icon: <LuUsers /> },
];

const LiveMonitor = () => {
  const [activeSegment, setActiveSegment] = React.useState("kassa");

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            Real-time
          </p>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Live Monitor{" "}
            <span style={{ color: "var(--color-blue)" }}>
              {activeSegment === "kassa"
                ? "Kassa"
                : activeSegment === "attraction"
                  ? "Attraksion"
                  : "Xodimlar"}
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Real-time park activity stream.
          </p>
        </div>

        <CusSegment
          value={activeSegment}
          onValueChange={setActiveSegment}
          iconPosition="left"
          items={items}
        />
      </div>

      {/* Active segment content */}
      <div>
        {activeSegment === "kassa" && <LiveMonitorKassa />}
        {activeSegment === "attraction" && <LiveMonitorAttraction />}
        {activeSegment === "employees" && <LiveMonitorEmployes />}
      </div>
    </div>
  );
};

export default LiveMonitor;
