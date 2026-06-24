import type { ElementType } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuBanknote, LuCalendarClock, LuFileText, LuUser, LuLogOut } from "react-icons/lu";

interface Props {
  onLogout: () => void;
}

const ITEMS: { path: string; exact?: boolean; Icon: ElementType; label: string }[] = [
  { path: "/rolekassa",        exact: true, Icon: LuBanknote,      label: "To'lov"   },
  { path: "/rolekassa/smena",              Icon: LuCalendarClock,  label: "Smena"    },
  { path: "/rolekassa/otchet",             Icon: LuFileText,       label: "Hisobot"  },
  { path: "/rolekassa/profile",            Icon: LuUser,           label: "Profil"   },
];

export function LeftRail({ onLogout }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function isActive(item: (typeof ITEMS)[0]) {
    return item.exact ? pathname === item.path : pathname.startsWith(item.path);
  }

  return (
    <div
      className="flex flex-col items-center py-3 shrink-0"
      style={{ width: 64, background: "#0e1521", borderRight: "1px solid #1c2532" }}
    >
      {ITEMS.map((item) => {
        const active = isActive(item);
        return (
          <button
            key={item.path}
            title={item.label}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-center rounded-xl mb-1 transition-colors"
            style={{
              width: 48,
              height: 48,
              background: active ? "rgba(31,116,214,0.16)" : "transparent",
              color: active ? "#1f74d6" : "#4a6580",
              border: active ? "1px solid rgba(31,116,214,0.28)" : "1px solid transparent",
            }}
          >
            <item.Icon size={22} />
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        title="Chiqish"
        onClick={onLogout}
        className="flex items-center justify-center rounded-xl transition-colors"
        style={{ width: 48, height: 48, color: "#4a6580", border: "1px solid transparent" }}
        onPointerEnter={(e) => {
          e.currentTarget.style.color = "#e53e3e";
          e.currentTarget.style.background = "rgba(229,62,62,0.1)";
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.color = "#4a6580";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <LuLogOut size={22} />
      </button>
    </div>
  );
}
