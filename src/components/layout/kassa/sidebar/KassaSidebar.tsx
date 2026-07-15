import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuLogOut,
  LuSun,
  LuMoon,
  LuX,
  LuUser,
  LuFileText,
  LuCreditCard,
} from "react-icons/lu";
import { TbReport } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/context/ThemeContext";
import { clearAuth } from "@/widgets/features/login/hooks/authApi";
import { getTodayReports } from "@/widgets/features/kassa/otchet/api/apiKassaOtchet";
import { CASHBOX_REPORTS_KEY } from "@/widgets/features/kassa/kassa.constants";
import { useCashbox } from "@/widgets/features/kassa/hooks/useCashbox";
import { VscDebugContinueSmall } from "react-icons/vsc";

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
  requiresActive?: boolean;
}

export const KASSA_NAV: NavItem[] = [
  {
    to: "/rolekassa",
    label: "Оплата",
    icon: LuCreditCard,
    end: true,
    requiresActive: true,
  },
  {
    to: "/rolekassa/smena",
    label: "Смена",
    icon: VscDebugContinueSmall,
    requiresActive: true,
  },
  { to: "/rolekassa/otchet", label: "Отчёт", icon: LuFileText },
  { to: "/rolekassa/profile", label: "Профиль", icon: LuUser },
];

// ─── Sidebar content (internal) ───────────────────────────────────────────────

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
  const { cashboxId } = useCashbox();
  const { data } = useQuery({
    queryKey: CASHBOX_REPORTS_KEY(cashboxId ?? 0),
    queryFn: () => getTodayReports(cashboxId!),
    enabled: !!cashboxId,
  });
  const xreports = data?.data["cashbox-reports"].xreports ?? [];
  const hasActiveX = xreports.some((x) => x.status === "open");
  const hasStopped = xreports.some((x) => x.status === "stopped");

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
              Панель кассира
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
        {KASSA_NAV.map((item) => {
          const isDisabled = item.requiresActive && (!hasActiveX || hasStopped);
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
                <item.icon
                  size={24}
                  style={{ color: "var(--text-muted)", flexShrink: 0 }}
                />
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
    </div>
  );
}

// ─── KassaSidebar (desktop aside + mobile overlay) ────────────────────────────

interface KassaSidebarProps {
  collapsed: boolean;
  sidebarOpen: boolean;
  onClose: () => void;
}

export function KassaSidebar({
  collapsed,
  sidebarOpen,
  onClose,
}: KassaSidebarProps) {
  return (
    <>
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
          onClose={onClose}
          onNavClick={() => {}}
        />
      </aside>

      {/* Mobile overlay drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 tablet:hidden transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 260 }}
      >
        <SidebarContent
          collapsed={false}
          onClose={onClose}
          onNavClick={onClose}
        />
      </div>
    </>
  );
}

// ─── KassaBottomNav ───────────────────────────────────────────────────────────

export function KassaBottomNav() {
  const { cashboxId } = useCashbox();
  const { data } = useQuery({
    queryKey: CASHBOX_REPORTS_KEY(cashboxId ?? 0),
    queryFn: () => getTodayReports(cashboxId!),
    enabled: !!cashboxId,
  });
  const xreports = data?.data["cashbox-reports"].xreports ?? [];
  const hasActiveX = xreports.some((x) => x.status === "open");
  const hasStopped = xreports.some((x) => x.status === "stopped");

  return (
    <nav
      className="tablet:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch px-2 pb-2 pt-1.5 gap-1"
      style={{
        height: 88,
        background: "var(--bg-main)",
        borderTop: "1px solid var(--border-default)",
      }}
    >
      {KASSA_NAV.map((item) => {
        const isDisabled = item.requiresActive && (!hasActiveX || hasStopped);
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
