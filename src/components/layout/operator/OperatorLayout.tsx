import { Suspense } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuFerrisWheel,
  LuCalendarDays,
  LuUser,
} from "react-icons/lu";

const tabs = [
  { to: "/operator",          icon: LuLayoutDashboard, label: "Bosh sahifa", end: true },
  { to: "/operator/tasks",    icon: LuFerrisWheel,     label: "Vazifalar" },
  { to: "/operator/schedule", icon: LuCalendarDays,    label: "Jadval" },
  { to: "/operator/profile",  icon: LuUser,            label: "Profil" },
];

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function OperatorLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-main)" }}>
      {/* Top header */}
      <header
        className="sticky top-0 z-40 h-14 flex items-center px-4 gap-3 shrink-0"
        style={{
          background: "var(--bg-main)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">P</span>
        </div>
        <div>
          <p className="font-semibold text-sm leading-none" style={{ color: "var(--text-default)" }}>
            ParkOps
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Operator Panel
          </p>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Suspense
          fallback={<PageLoader />}
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 h-16 flex items-stretch"
        style={{
          background: "var(--bg-main)",
          borderTop: "1px solid var(--border-default)",
        }}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors
              ${isActive ? "text-blue-400" : ""}`
            }
            style={({ isActive }) => ({
              color: isActive ? undefined : "var(--text-muted)",
            })}
          >
            {({ isActive }) => (
              <>
                <tab.icon size={20} className={isActive ? "text-blue-400" : ""} />
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
