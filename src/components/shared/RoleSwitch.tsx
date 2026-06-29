import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard, LuBanknote, LuUser } from "react-icons/lu";
import { getStoredRole, getRoleDefaultPath } from "@/widgets/features/login/api/authApi";
import { RoleTypes } from "@/const/constData";

const ROLE_COOKIE = "parkops_role";
const AUTH_TTL_HOURS = 20;

const ROLES = [
  { id: RoleTypes.SUPERADMIN, label: "Admin",    icon: LuLayoutDashboard },
  { id: RoleTypes.CASHIER,    label: "Kassa",    icon: LuBanknote },
  { id: RoleTypes.OPERATOR,   label: "Operator", icon: LuUser },
] as const;

function setRoleCookie(role: string) {
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(role)}; max-age=${AUTH_TTL_HOURS * 3600}; path=/; SameSite=Strict`;
}

export default function RoleSwitch() {
  const navigate = useNavigate();
  const currentRole = getStoredRole();

  function handleSwitch(role: string) {
    if (role === currentRole) return;
    setRoleCookie(role);
    navigate(getRoleDefaultPath(role), { replace: true });
  }

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-lg border"
      style={{ borderColor: "var(--border-default)", background: "var(--bg-second)" }}
    >
      {ROLES.map(({ id, label, icon: Icon }) => {
        const isActive = currentRole === id;
        return (
          <button
            key={id}
            onClick={() => handleSwitch(id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
            style={{
              color: isActive ? "#fff" : "var(--text-muted)",
              background: isActive ? "#2563eb" : "transparent",
            }}
          >
            <Icon size={13} />
            <span className="hidden tablet:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
