import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuActivity,
  LuUsers,
  LuFerrisWheel,
  LuChartBar,
  LuSettings,
  LuLifeBuoy,
  LuX,
  LuCircleCheck,
  LuClock,
  LuBanknote,
} from "react-icons/lu";
import { IoQrCodeSharp } from "react-icons/io5";
import { useTranslation } from "../../../../i18n/languageConfig";
import { SiTestcafe } from "react-icons/si";

interface NavItemDef {
  labelKey: string;
  icon: IconType;
  to: string;
}

interface NavGroupDef {
  labelKey: string;
  items: NavItemDef[];
}

const navGroups: NavGroupDef[] = [
  {
    labelKey: "main",
    items: [
      { labelKey: "dashboard", icon: LuLayoutDashboard, to: "/" },
      { labelKey: "liveMonitor", icon: LuActivity, to: "/live-monitor" },
      { labelKey: "reports", icon: LuChartBar, to: "/reports" },
    ],
  },
  {
    labelKey: "control",
    items: [
      { labelKey: "employees", icon: LuUsers, to: "/employees" },
      { labelKey: "attractions", icon: LuFerrisWheel, to: "/attractions" },
      { labelKey: "kassa", icon: LuBanknote, to: "/kassa" },
      { labelKey: "qrCode", icon: IoQrCodeSharp, to: "/qrcode" },
    ],
  },
];

const systemItems: NavItemDef[] = [
  { labelKey: "settings", icon: LuSettings, to: "/settings" },
  { labelKey: "support", icon: LuLifeBuoy, to: "/support" },
  ...(import.meta.env.DEV
    ? [{ labelKey: "test-UI", icon: SiTestcafe, to: "/test-ui" }]
    : []),
];

function NavItem({
  item,
  onNavClick,
}: {
  item: NavItemDef;
  onNavClick: () => void;
}) {
  const { t } = useTranslation("sidebar.");
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onNavClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
        ${
          isActive
            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
            : "border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
        }`
      }
      style={({ isActive }) => ({
        color: isActive ? undefined : "var(--text-4)",
      })}
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={16}
            style={{ color: isActive ? undefined : "var(--text-muted)" }}
            className={
              isActive ? "text-blue-400" : "group-hover:text-slate-300"
            }
          />
          {t(item.labelKey)}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({
  onClose,
  onNavClick,
}: {
  onClose: () => void;
  onNavClick: () => void;
}) {
  const { t } = useTranslation("sidebar.");
  return (
    <div
      className="w-56 h-full flex flex-col"
      style={{
        background: "var(--bg-main)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Logo + close */}
      <div
        className="flex items-center gap-2.5 px-4 py-5 border-b shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <div className="flex-1">
          <p
            className="font-semibold text-sm leading-none"
            style={{ color: "var(--text-default)" }}
          >
            ParkOps
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Control Center
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
        >
          <LuX size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div
            key={group.labelKey}
            className={gi > 0 ? "mt-4 pt-4" : ""}
            style={
              gi > 0 ? { borderTop: "1px solid var(--border-default)" } : {}
            }
          >
            <p
              className="text-[10px] font-medium uppercase tracking-wider px-3 mb-2"
              style={{ color: "var(--text-dim)" }}
            >
              {t(group.labelKey)}
            </p>
            <div className="space-y-1">
              {group.items.map((item: NavItemDef) => (
                <NavItem key={item.to} item={item} onNavClick={onNavClick} />
              ))}
            </div>
          </div>
        ))}

        <p
          className="text-xs font-medium uppercase tracking-wider px-3 mt-4 mb-2 pt-4"
          style={{
            borderTop: "1px solid var(--border-default)",
            color: "var(--text-dim)",
          }}
        >
          {t("system")}
        </p>
        <div className="space-y-1">
          {systemItems.map((item: NavItemDef) => (
            <NavItem key={item.to} item={item} onNavClick={onNavClick} />
          ))}
        </div>
      </nav>

      {/* Status bar — sidebar ichida */}
      <div
        className="px-4 py-3 flex flex-col gap-1 shrink-0"
        style={{ borderTop: "1px solid var(--border-default)" }}
      >
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--text-4)" }}
        >
          <LuCircleCheck size={12} className="text-green-400 shrink-0" />
          <span>{t("systemsNormal")}</span>
        </div>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <LuClock size={12} className="shrink-0" />
          <div>
            <p
              className="font-medium leading-none"
              style={{ color: "var(--text-3)" }}
            >
              {t("parkOpen")}
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {t("parkHours")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNavClick: () => void;
}

export default function Sidebar({ open, onClose, onNavClick }: SidebarProps) {
  return (
    <>
      {/* Desktop: sticky flex child — joy egallaydi */}
      <aside
        className={`hidden desktop:block shrink-0 overflow-hidden sticky top-0 h-screen
          transition-[width] duration-300 ease-in-out
          ${open ? "w-56" : "w-0"}`}
      >
        <SidebarContent onClose={onClose} onNavClick={onNavClick} />
      </aside>

      {/* Mobile / tablet: fixed overlay drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 desktop:hidden
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent onClose={onClose} onNavClick={onNavClick} />
      </div>
    </>
  );
}
