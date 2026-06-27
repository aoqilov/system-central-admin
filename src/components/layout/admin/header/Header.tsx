import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LuBell,
  LuChevronDown,
  LuMenu,
  LuPanelLeftClose,
  LuPanelLeft,
  LuSettings,
  LuLogOut,
  LuSun,
  LuMoon,
  LuLock,
} from "react-icons/lu";
import { CusPopover } from "../../../ui/popover/CusPopover";
import { useTheme } from "../../../../context/ThemeContext";
import { clearAuth } from "@/widgets/features/login/api/authApi";
import { isPinEnabled, lockApp } from "@/utils/pinLock";
import RoleSwitch from "@/components/shared/RoleSwitch";

interface HeaderProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ sidebarOpen, onMenuToggle }: HeaderProps) {
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
  const [pinEnabled, setPinEnabled] = useState(() => isPinEnabled());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tick = () =>
      setTimeStr(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onPinChanged() {
      setPinEnabled(isPinEnabled());
    }
    window.addEventListener("pin-lock-changed", onPinChanged);
    return () => window.removeEventListener("pin-lock-changed", onPinChanged);
  }, []);

  const { theme, toggle } = useTheme();

  function handleLogout() {
    clearAuth();
    navigate("/login", { state: { from: location }, replace: true });
  }

  function handleLock() {
    lockApp();
    navigate("/lock", { replace: true });
  }

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center px-4 gap-3"
      style={{
        background: "var(--bg-main)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: "var(--text-muted)" }}
      >
        <LuMenu size={18} className="desktop:hidden" />
        {sidebarOpen ? (
          <LuPanelLeftClose size={18} className="hidden desktop:block" />
        ) : (
          <LuPanelLeft size={18} className="hidden desktop:block" />
        )}
      </button>

      <RoleSwitch />

      <div className="flex items-center gap-2 ml-auto">
        {/* Live indicator — tablet+ */}
        <div
          className="hidden tablet:flex items-center gap-2 text-xs"
          style={{ color: "var(--text-4)" }}
        >
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-md" style={{ color: "var(--text-3)" }}>
            Live
          </span>
          <span className="font-mono text-xl" style={{ color: "var(--text-3)" }}>
            {timeStr}
          </span>
        </div>

        <button
          className="relative p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: "var(--text-4)" }}
        >
          <LuBell size={16} />
          <span className="absolute top-0.5 right-1 w-3 h-3 bg-blue-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
            2
          </span>
        </button>

        {/* Lock button — faqat PIN yoqilgan bo'lsa */}
        {pinEnabled && (
          <button
            onClick={handleLock}
            className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-4)" }}
            title="Ekranni bloklash"
          >
            <LuLock size={16} />
          </button>
        )}

        {/* User menu */}
        <CusPopover
          placement="bottom-end"
          width={220}
          trigger={(open) => (
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 border"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                O
              </div>
              <div className="text-left hidden tablet:block">
                <p
                  className="text-xs font-medium leading-none"
                  style={{ color: "var(--text-2)" }}
                >
                  Owner
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  admin@park.io
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
          {/* User info */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border-default)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--text-default)" }}>
              Owner
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              admin@park.io
            </p>
          </div>

          {/* Menu items */}
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--text-2)" }}
            >
              <LuSettings size={14} style={{ color: "var(--text-muted)" }} />
              Sozlamalar
            </button>

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
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
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
