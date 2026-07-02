import { Suspense, useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuCreditCard,
  LuUser,
  LuLogOut,
  LuSun,
  LuMoon,
  LuPanelLeftClose,
  LuPanelLeft,
  LuChevronDown,
  LuX,
  LuPhone,
} from "react-icons/lu";
import dayjs from "dayjs";
import { useTheme } from "../../../context/ThemeContext";
import { CusPopover } from "../../ui/popover/CusPopover";
import { CusImagePreview } from "../../ui/image/CusImagePreview";
import { clearAuth } from "@/widgets/features/login/api/authApi";
import { useMe } from "@/widgets/api-global/files-route/auth";
import { useActiveXreport } from "@/widgets/features/operator/hooks/useActiveXreport";
import { useOperatorAttraction } from "@/widgets/features/operator/hooks/useOperatorAttraction";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import RoleSwitch from "@/components/shared/RoleSwitch";
import { RiFileList3Line } from "react-icons/ri";
import { VscDebugContinueSmall } from "react-icons/vsc";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
  restricted?: boolean;
}

const NAV: NavItem[] = [
  {
    to: "/operator/payment",
    icon: LuCreditCard,
    label: "Оплата",
    restricted: true,
  },
  {
    to: "/operator/home",
    icon: VscDebugContinueSmall,
    label: "Актив смена",
    restricted: true,
    end: true,
  },
  { to: "/operator/smena", icon: RiFileList3Line, label: "Смена" },
  { to: "/operator/profile", icon: LuUser, label: "Профиль" },
];

// ─── Live clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="font-mono text-2xl font-bold"
      style={{ color: "var(--text-3)" }}
    >
      {dayjs(now).format("HH:mm")}
    </span>
  );
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({
  collapsed,
  onClose,
  onNavClick,
  hasActiveX,
}: {
  collapsed: boolean;
  onClose: () => void;
  onNavClick: () => void;
  hasActiveX: boolean;
}) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: "var(--bg-main)",
        borderRight: "1px solid var(--border-default)",
        overflow: "hidden",
      }}
    >
      {/* Logo + close (mobile) */}
      <div
        className="flex items-center border-b shrink-0"
        style={{
          borderColor: "var(--border-default)",
          height: 72,
          padding: "0 16px",
          gap: 10,
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-sm leading-none"
              style={{ color: "var(--text-default)" }}
            >
              ParkOps
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              Панель оператора
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onClose}
            className="desktop:hidden p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            <LuX size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto flex flex-col gap-0.5">
        {NAV.map((item) => {
          const isDisabled = !!item.restricted && !hasActiveX;

          if (isDisabled) {
            return (
              <div
                key={item.to}
                title={collapsed ? item.label : undefined}
                className="flex items-center rounded-lg text-base font-medium border border-transparent"
                style={{
                  color: "var(--text-muted)",
                  opacity: 0.4,
                  cursor: "not-allowed",
                  gap: collapsed ? 0 : 12,
                  padding: collapsed ? "18px 20px" : "18px 16px",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <item.icon size={24} style={{ flexShrink: 0 }} />
                {!collapsed && item.label}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavClick}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-base font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? undefined : "var(--text-4)",
                gap: collapsed ? 0 : 12,
                padding: collapsed ? "18px 20px" : "18px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={24}
                    style={{
                      color: isActive ? undefined : "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  />
                  {!collapsed && item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: theme + logout */}
      <div
        className="px-2 pb-3 pt-2 flex flex-col gap-0.5 border-t shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <CusButton
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          colorPalette="orange"
          variant="solid"
        >
          SOS
        </CusButton>
      </div>
    </div>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNav({ hasActiveX }: { hasActiveX: boolean }) {
  return (
    <nav
      className="desktop:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch px-2 pb-2 pt-1.5 gap-1"
      style={{
        height: 88,
        background: "var(--bg-main)",
        borderTop: "1px solid var(--border-default)",
      }}
    >
      {NAV.map((item) => {
        const isDisabled = !!item.restricted && !hasActiveX;

        if (isDisabled) {
          return (
            <div
              key={item.to}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-medium"
              style={{
                color: "var(--text-muted)",
                opacity: 0.35,
                cursor: "not-allowed",
              }}
            >
              <item.icon size={26} />
              <span>{item.label}</span>
            </div>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition-all duration-150"
            style={({ isActive }) => ({
              color: isActive ? "#60a5fa" : "var(--text-muted)",
              background: isActive ? "rgba(59,130,246,0.10)" : "transparent",
            })}
          >
            <item.icon size={26} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

// ─── Layout body ──────────────────────────────────────────────────────────────

function OperatorLayoutBody() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: me } = useMe();
  const { attraction } = useOperatorAttraction();
  const hasActiveX = useActiveXreport(attraction?.id);

  const fullName = me ? `${me.firstname} ${me.lastname}` : "Operator";
  const avatarUrl = me?.file ? getFileUrl(me.file) : null;
  const initial = fullName.charAt(0).toUpperCase();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className="min-h-screen desktop:flex"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 desktop:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sticky sidebar */}
      <aside
        className="hidden desktop:block shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{
          width: collapsed ? 72 : 260,
          transition: "width 300ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          onClose={() => setSidebarOpen(false)}
          onNavClick={() => {}}
          hasActiveX={hasActiveX}
        />
      </aside>

      {/* Mobile overlay drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 desktop:hidden
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 260 }}
      >
        <SidebarContent
          collapsed={false}
          onClose={() => setSidebarOpen(false)}
          onNavClick={() => setSidebarOpen(false)}
          hasActiveX={hasActiveX}
        />
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <header
          className="sticky top-0 z-40 h-[72px] flex items-center px-4 gap-3 shrink-0"
          style={{
            background: "var(--bg-main)",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          {/* Logo — mobile only */}
          <div className="flex desktop:hidden items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <div>
              <p
                className="font-bold text-sm leading-none"
                style={{ color: "var(--text-default)" }}
              >
                ParkOps
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Панель оператора
              </p>
            </div>
          </div>

          {/* Sidebar toggle — desktop only */}
          <button
            onClick={() => setCollapsed((o) => !o)}
            className="hidden desktop:flex p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            {collapsed ? (
              <LuPanelLeft size={18} />
            ) : (
              <LuPanelLeftClose size={18} />
            )}
          </button>

          <RoleSwitch />

          {/* Right: clock + user popover */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-4)" }}
              >
                Live
              </span>
              <LiveClock />
            </div>

            <CusPopover
              placement="bottom-end"
              width={240}
              trigger={(open) => (
                <button
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 border"
                  style={{ borderColor: "var(--border-default)" }}
                >
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
                  <div className="text-left hidden desktop:block">
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
                    className="ml-1 hidden desktop:block transition-transform duration-200"
                    style={{
                      color: "var(--text-muted)",
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
              )}
            >
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
                  {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
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
                  Выйти
                </button>
              </div>
            </CusPopover>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 pb-20 desktop:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav hasActiveX={hasActiveX} />
    </div>
  );
}

// ─── Layout (default export) ──────────────────────────────────────────────────

export default function OperatorLayout() {
  useEffect(() => {
    const KEY = "dntdiOP";

    let existing = localStorage.getItem(KEY);

    if (!existing) {
      const generated = Math.floor(
        1000000 + Math.random() * 9000000,
      ).toString();

      localStorage.setItem(KEY, generated);
      console.log("Generated device key:", generated);
    } else {
      console.log("Existing device key:", existing);
    }
  }, []);
  return <OperatorLayoutBody />;
}
