import { Suspense, useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuCreditCard, LuUser } from "react-icons/lu";
import dayjs from "dayjs";

const tabs = [
  { to: "/operator", icon: LuLayoutDashboard, label: "Bosh sahifa", end: true },
  { to: "/operator/payment", icon: LuCreditCard, label: "To'lov" },
  { to: "/operator/profile", icon: LuUser, label: "Profil" },
];

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString("uz-UZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="text-right">
      <p
        className="font-bold font-mono leading-none"
        style={{ fontSize: 18, color: "var(--text-default)" }}
      >
        {dayjs(now).format("HH:mm") /* toLocaleTimeString() */}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
        {dayjs(now).format("ddd, D MMM")}
      </p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function OperatorLayout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-second)" }}>
      {/* Centered container */}
      <div
        className="relative min-h-screen flex flex-col mx-auto"
        style={{
          maxWidth: 768,
          background: "var(--bg-main)",
          borderLeft: "1px solid var(--border-default)",
          borderRight: "1px solid var(--border-default)",
        }}
      >
        {/* Top header */}
        <header
          className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 shrink-0"
          style={{
            background: "var(--bg-main)",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          {/* Chap tomon */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <div>
              <p
                className="font-semibold text-sm leading-none"
                style={{ color: "var(--text-default)" }}
              >
                ParkOps
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Operator Panel
              </p>
            </div>
          </div>

          {/* Ong tomon — jonli soat */}
          <LiveClock />
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>

        {/* Bottom tab bar */}
        <nav
          className="sticky bottom-0 z-40 flex items-stretch shrink-0 px-2 pb-2 pt-1.5 gap-1"
          style={{
            height: 72,
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl text-[11px] font-medium transition-all duration-150"
              style={({ isActive }) => ({
                color: isActive ? "#60a5fa" : "var(--text-muted)",
                background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
              })}
            >
              <tab.icon size={22} />
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
