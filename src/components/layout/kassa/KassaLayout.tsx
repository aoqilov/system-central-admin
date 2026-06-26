import { Suspense, useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuLogOut,
  LuSun,
  LuMoon,
  LuPanelLeftClose,
  LuPanelLeft,
  LuChevronDown,
  LuX,
  LuUser,
  LuFileText,
} from "react-icons/lu";
import { TbReport } from "react-icons/tb";
import dayjs from "dayjs";
import { useTheme } from "../../../context/ThemeContext";
import { CusPopover } from "../../ui/popover/CusPopover";
import { clearAuth } from "@/widgets/features/login/api/authApi";
import { SmenaProvider, useSmena } from "@/context/SmenaContext";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
  requiresActive?: boolean;
}

const NAV: NavItem[] = [
  { to: "/rolekassa", label: "Tolov qilish", icon: LuLayoutDashboard, end: true, requiresActive: true },
  { to: "/rolekassa/smena", label: "Smena", icon: TbReport, requiresActive: true },
  { to: "/rolekassa/otchet", label: "Otchet", icon: LuFileText },
  { to: "/rolekassa/profile", label: "Profil", icon: LuUser },
];

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
}: {
  collapsed: boolean;
  onClose: () => void;
  onNavClick: () => void;
}) {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { active } = useSmena();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: "#fff",
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
          padding: collapsed ? "0 16px" : "0 16px",
          gap: 10,
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-none" style={{ color: "var(--text-default)" }}>
              ParkOps
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              Kassa Panel
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onClose}
            className="tablet:hidden p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            <LuX size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto flex flex-col gap-0.5">
        {NAV.map((item) => {
          const isDisabled = item.requiresActive && !active;
          if (isDisabled) {
            return (
              <div
                key={item.to}
                className="flex items-center rounded-lg text-base font-medium border border-transparent"
                style={{
                  color: "var(--text-4)",
                  gap: collapsed ? 0 : 12,
                  padding: collapsed ? "18px 20px" : "18px 16px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  opacity: 0.35,
                  cursor: "not-allowed",
                }}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={24} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
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
                `flex items-center rounded-lg text-base font-medium transition-all duration-150 group
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
                    style={{ color: isActive ? undefined : "var(--text-muted)", flexShrink: 0 }}
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
        <button
          onClick={toggle}
          title={collapsed ? (theme === "dark" ? "Yorug' rejim" : "Qorong'u rejim") : undefined}
          className="flex items-center rounded-lg text-base font-medium transition-all duration-150 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
          style={{
            color: "var(--text-4)",
            gap: collapsed ? 0 : 12,
            padding: collapsed ? "18px 20px" : "18px 16px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {theme === "dark" ? (
            <LuSun size={24} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          ) : (
            <LuMoon size={24} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          )}
          {!collapsed && (theme === "dark" ? "Yorug' rejim" : "Qorong'u rejim")}
        </button>

        <button
          onClick={handleLogout}
          title={collapsed ? "Chiqish" : undefined}
          className="flex items-center rounded-lg text-base font-medium transition-all duration-150 border border-transparent"
          style={{
            color: "#ef4444",
            gap: collapsed ? 0 : 12,
            padding: collapsed ? "18px 20px" : "18px 16px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <LuLogOut size={24} style={{ flexShrink: 0 }} />
          {!collapsed && "Chiqish"}
        </button>
      </div>
    </div>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNav() {
  const { active } = useSmena();
  return (
    <nav
      className="tablet:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch px-2 pb-2 pt-1.5 gap-1"
      style={{
        height: 88,
        background: "var(--bg-main)",
        borderTop: "1px solid var(--border-default)",
      }}
    >
      {NAV.map((item) => {
        const isDisabled = item.requiresActive && !active;
        if (isDisabled) {
          return (
            <div
              key={item.to}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-medium"
              style={{ color: "var(--text-muted)", opacity: 0.35, cursor: "not-allowed" }}
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

// ─── Layout inner ─────────────────────────────────────────────────────────────

function KassaLayoutBody() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen tablet:flex" style={{ background: "var(--bg-main)" }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 tablet:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sticky sidebar */}
      <aside
        className="hidden tablet:block shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{
          width: collapsed ? 72 : 260,
          transition: "width 300ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          onClose={() => setSidebarOpen(false)}
          onNavClick={() => {}}
        />
      </aside>

      {/* Mobile overlay drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 tablet:hidden
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent
          collapsed={false}
          onClose={() => setSidebarOpen(false)}
          onNavClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <header
          className="sticky top-0 z-40 h-[72px] flex items-center justify-between px-4 gap-3 shrink-0"
          style={{
            background: "#fff",
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
            onClick={() => setCollapsed((o) => !o)}
            className="hidden tablet:flex p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            {collapsed ? <LuPanelLeft size={18} /> : <LuPanelLeftClose size={18} />}
          </button>

          <div className="flex items-center gap-4">
            {/* Live clock */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: "var(--text-4)" }}>Live</span>
              <LiveClock />
            </div>

            {/* User popover */}
            <div className="ml-auto">
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
                  <p className="text-xs font-semibold" style={{ color: "var(--text-default)" }}>Kassir</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>kassa@park.io</p>
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
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 pb-20 tablet:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}

// ─── Layout (default export) ──────────────────────────────────────────────────

export default function KassaLayout() {
  return (
    <SmenaProvider>
      <KassaLayoutBody />
    </SmenaProvider>
  );
}
