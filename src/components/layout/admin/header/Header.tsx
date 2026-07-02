import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  LuPhone,
} from "react-icons/lu";
import { CusPopover } from "../../../ui/popover/CusPopover";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { useTheme } from "../../../../context/ThemeContext";
import {
  clearAuth,
  getStoredEmployeeId,
} from "@/widgets/features/login/api/authApi";
import { isPinEnabled, lockApp } from "@/utils/pinLock";
import RoleSwitch from "@/components/shared/RoleSwitch";
import { fetchEmployee } from "@/widgets/features/admin/employees/api/employeesApi";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";

interface HeaderProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ sidebarOpen, onMenuToggle }: HeaderProps) {
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [pinEnabled, setPinEnabled] = useState(() => isPinEnabled());
  const navigate = useNavigate();
  const location = useLocation();

  const employeeId = getStoredEmployeeId();
  const { data: me } = useQuery({
    queryKey: ["me", employeeId],
    queryFn: () => fetchEmployee(employeeId!),
    enabled: employeeId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const fullName = me ? `${me.lastname} ${me.firstname}` : "—";
  const initial = me?.firstname?.[0]?.toUpperCase() ?? "?";
  const avatarUrl = me?.file ? getFileUrl(me.file) : null;

  useEffect(() => {
    const tick = () =>
      setTimeStr(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
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

      {/* <RoleSwitch /> */}

      <div className="flex items-center gap-2 ml-auto">
        {/* Live indicator — tablet+ */}
        <div
          className="hidden tablet:flex items-center gap-2 text-xs"
          style={{ color: "var(--text-4)" }}
        >
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span
            className="font-mono text-md"
            style={{ color: "var(--text-3)" }}
          >
            Live
          </span>
          <span
            className="font-mono text-xl"
            style={{ color: "var(--text-3)" }}
          >
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
          width={240}
          trigger={(open) => (
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 border"
              style={{ borderColor: "var(--border-default)" }}
            >
              {/* Avatar */}
              {avatarUrl ? (
                <CusImagePreview
                  src={avatarUrl}
                  alt={fullName}
                  width={24}
                  height={24}
                  borderRadius="50%"
                  preview={false}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initial}
                </div>
              )}

              <div className="text-left hidden tablet:block">
                <p
                  className="text-xs font-medium leading-none"
                  style={{ color: "var(--text-2)" }}
                >
                  {fullName}
                </p>
                {me?.phone_number && (
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {me.phone_number}
                  </p>
                )}
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
            className="px-4 py-3 border-b flex items-center gap-3"
            style={{ borderColor: "var(--border-default)" }}
          >
            {avatarUrl ? (
              <CusImagePreview
                src={avatarUrl}
                alt={fullName}
                width={40}
                height={40}
                borderRadius="50%"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "var(--text-default)" }}
              >
                {fullName}
              </p>
              {me?.phone_number && (
                <p
                  className="flex items-center gap-1 text-[11px] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <LuPhone size={10} />
                  {me.phone_number}
                </p>
              )}
            </div>
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
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
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
