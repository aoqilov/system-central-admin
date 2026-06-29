import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuLogOut,
  LuSun,
  LuMoon,
  LuPanelLeftClose,
  LuPanelLeft,
  LuChevronDown,
} from "react-icons/lu";
import dayjs from "dayjs";
import { useTheme } from "@/context/ThemeContext";
import { CusPopover } from "@/components/ui/popover/CusPopover";
import { clearAuth } from "@/widgets/features/login/api/authApi";
import RoleSwitch from "@/components/shared/RoleSwitch";

// ─── Live clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-2xl font-bold" style={{ color: "var(--text-3)" }}>
      {dayjs(now).format("HH:mm")}
    </span>
  );
}

// ─── KassaHeader ──────────────────────────────────────────────────────────────

interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function KassaHeader({ collapsed, onToggleCollapse }: Props) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <header
      className="sticky top-0 z-40 h-[72px] flex items-center px-4 gap-3 shrink-0"
      style={{
        background: "var(--bg-main)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      {/* Logo — mobile only */}
      <div className="flex tablet:hidden items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">P</span>
        </div>
        <div>
          <p className="font-bold text-sm leading-none" style={{ color: "var(--text-default)" }}>
            ParkOps
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Kassa Panel
          </p>
        </div>
      </div>

      {/* Sidebar toggle — desktop */}
      <button
        onClick={onToggleCollapse}
        className="hidden tablet:flex p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: "var(--text-muted)" }}
      >
        {collapsed ? <LuPanelLeft size={18} /> : <LuPanelLeftClose size={18} />}
      </button>

      <RoleSwitch />

      <div className="flex items-center gap-4 ml-auto">
        {/* Live clock */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono" style={{ color: "var(--text-4)" }}>
            Live
          </span>
          <LiveClock />
        </div>

        {/* User popover */}
        <CusPopover
          placement="bottom-end"
          width={220}
          trigger={(open) => (
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 border"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                K
              </div>
              <div className="text-left hidden tablet:block">
                <p className="text-xs font-medium leading-none" style={{ color: "var(--text-2)" }}>
                  Kassir
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  kassa@park.io
                </p>
              </div>
              <LuChevronDown
                size={12}
                className="ml-1 hidden tablet:block transition-transform duration-200"
                style={{
                  color: "var(--text-muted)",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
          )}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-default)" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--text-default)" }}>
              Kassir
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              kassa@park.io
            </p>
          </div>
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={toggle}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--text-2)" }}
            >
              {theme === "dark" ? (
                <LuSun size={14} style={{ color: "var(--text-muted)" }} />
              ) : (
                <LuMoon size={14} style={{ color: "var(--text-muted)" }} />
              )}
              {theme === "dark" ? "Yorug' rejim" : "Qorong'u rejim"}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#ef4444" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <LuLogOut size={14} />
              Chiqish
            </button>
          </div>
        </CusPopover>
      </div>
    </header>
  );
}
