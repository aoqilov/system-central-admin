import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  LuChevronDown,
  LuFileCheck,
  LuFileOutput,
  LuFileInput,
} from "react-icons/lu";
import { IoQrCodeSharp } from "react-icons/io5";
import { useTranslation } from "../../../../i18n/languageConfig";
import { SiTestcafe } from "react-icons/si";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItemDef {
  labelKey: string;
  icon: IconType;
  to: string;
  subItems?: never;
}

interface SubItemDef {
  labelKey: string;
  icon: IconType;
  to: string;
}

interface NavSubMenuDef {
  labelKey: string;
  icon: IconType;
  to?: never;
  subItems: SubItemDef[];
}

type NavEntry = NavItemDef | NavSubMenuDef;

interface NavGroupDef {
  labelKey: string;
  items: NavEntry[];
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const navGroups: NavGroupDef[] = [
  {
    labelKey: "main",
    items: [
      { labelKey: "dashboard", icon: LuLayoutDashboard, to: "/" },
      {
        labelKey: "liveMonitor",
        icon: LuActivity,
        subItems: [
          {
            labelKey: "liveKassa",
            icon: LuBanknote,
            to: "/live-monitor/kassa",
          },
          {
            labelKey: "liveAttraction",
            icon: LuFerrisWheel,
            to: "/live-monitor/attraction",
          },
          {
            labelKey: "liveEmployees",
            icon: LuUsers,
            to: "/live-monitor/employees",
          },
        ],
      },
      {
        labelKey: "reports",
        icon: LuChartBar,
        subItems: [
          { labelKey: "reportsKassa", icon: LuBanknote, to: "/reports/kassa" },
          {
            labelKey: "reportsAttraction",
            icon: LuFerrisWheel,
            to: "/reports/attraction",
          },
          {
            labelKey: "reportsEmployees",
            icon: LuUsers,
            to: "/reports/employees",
          },
        ],
      },
    ],
  },
  {
    labelKey: "control",
    items: [
      { labelKey: "employees", icon: LuUsers, to: "/employees" },
      { labelKey: "attractions", icon: LuFerrisWheel, to: "/attractions" },
      { labelKey: "kassa", icon: LuBanknote, to: "/kassa" },
      {
        labelKey: "kassaZReport",
        icon: LuFileCheck,
        subItems: [
          {
            labelKey: "kassaIncoming",
            icon: LuFileCheck,
            to: "/rolekassa-main/incoming",
          },
          {
            labelKey: "kassaExport",
            icon: LuFileOutput,
            to: "/rolekassa-main/export",
          },
        ],
      },
      {
        labelKey: "operatorZReport",
        icon: LuFileCheck,
        subItems: [
          {
            labelKey: "operatorIncoming",
            icon: LuFileCheck,
            to: "/roleoperator-main/incoming",
          },
          {
            labelKey: "operatorExport",
            icon: LuFileOutput,
            to: "/roleoperator-main/export",
          },
        ],
      },
      {
        labelKey: "buxZReport",
        icon: LuFileInput,
        subItems: [
          {
            labelKey: "buxIncomingKassa",
            icon: LuFileInput,
            to: "/rolebux-main/incoming-kassa",
          },
          {
            labelKey: "buxIncomingOperator",
            icon: LuFileInput,
            to: "/rolebux-main/incoming-operator",
          },
        ],
      },
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

// ─── NavItem ──────────────────────────────────────────────────────────────────

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
            ? "bg-blue-500 text-white border border-blue-600"
            : "border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
        }`
      }
      style={({ isActive }) => ({
        color: isActive ? "#ffffff" : "var(--text-4)",
      })}
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={16}
            style={{ color: isActive ? "#ffffff" : "var(--text-muted)" }}
            className={isActive ? "" : "group-hover:text-slate-300"}
          />
          {t(item.labelKey)}
        </>
      )}
    </NavLink>
  );
}

// ─── NavSubMenu ───────────────────────────────────────────────────────────────

function NavSubMenu({
  item,
  onNavClick,
}: {
  item: NavSubMenuDef;
  onNavClick: () => void;
}) {
  const { t } = useTranslation("sidebar.");
  const location = useLocation();
  const isAnyActive = item.subItems.some((s) =>
    location.pathname.startsWith(s.to),
  );
  const [open, setOpen] = useState(isAnyActive);
  const ParentIcon = item.icon;

  useEffect(() => {
    if (isAnyActive) setOpen(true);
  }, [isAnyActive]);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: isAnyActive ? "var(--text-default)" : "var(--text-4)" }}
      >
        <ParentIcon
          size={16}
          style={{ color: isAnyActive ? "#60a5fa" : "var(--text-muted)" }}
        />
        <span className="flex-1 text-left">{t(item.labelKey)}</span>
        <LuChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}
        />
      </button>

      {open && (
        <div
          className="ml-3 mt-0.5 space-y-0.5 pl-3 border-l"
          style={{ borderColor: "var(--border-default)" }}
        >
          {item.subItems.map((sub) => {
            const isActive = location.pathname === sub.to;
            const SubIcon = sub.icon;
            return (
              <NavLink
                key={sub.to}
                to={sub.to}
                onClick={onNavClick}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 border
                  ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-600"
                      : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                style={{ color: isActive ? "#ffffff" : "var(--text-4)" }}
              >
                <SubIcon
                  size={13}
                  style={{ color: isActive ? "#ffffff" : "var(--text-muted)" }}
                />
                {t(sub.labelKey)}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────

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
              {group.items.map((entry) =>
                entry.subItems ? (
                  <NavSubMenu
                    key={entry.labelKey}
                    item={entry as NavSubMenuDef}
                    onNavClick={onNavClick}
                  />
                ) : (
                  <NavItem
                    key={(entry as NavItemDef).to}
                    item={entry as NavItemDef}
                    onNavClick={onNavClick}
                  />
                ),
              )}
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
          {systemItems.map((item) => (
            <NavItem key={item.to} item={item} onNavClick={onNavClick} />
          ))}
        </div>
      </nav>

      {/* Status bar */}
      {/* <div
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
      </div> */}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNavClick: () => void;
}

export default function Sidebar({ open, onClose, onNavClick }: SidebarProps) {
  return (
    <>
      {/* Desktop: sticky */}
      <aside
        className={`hidden desktop:block shrink-0 overflow-hidden sticky top-0 h-screen
          transition-[width] duration-300 ease-in-out
          ${open ? "w-56" : "w-0"}`}
      >
        <SidebarContent onClose={onClose} onNavClick={onNavClick} />
      </aside>

      {/* Mobile / tablet: fixed overlay */}
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
