import { useNavigate } from "react-router-dom";
import {
  LuMoon,
  LuGlobe,
  LuLogOut,
  LuBanknote,
  LuTicket,
  LuClock,
  LuActivity,
  LuPhone,
  LuSend,
  LuCalendar,
  LuBriefcase,
} from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation, type Lang } from "../../i18n/languageConfig";
import { CusSwitch } from "../../components/ui/inputs/CusSwitch";
import { clearAuth } from "@/widgets/features/login/api/authApi";
import { employees, EmployeeRole, EmployeeStatus, type CashierStats } from "../../data/employees";
import { kassaList } from "../../data/kassa";

// ─── Demo: birinchi kassir ────────────────────────────────────────────────────

const DEMO_CASHIER = employees.find((e) => e.role === EmployeeRole.CASHIER)!;
const DEMO_KASSA = kassaList.find((k) => k.cashierId === DEMO_CASHIER?.id) ?? kassaList[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  return n.toLocaleString();
}

function fmtMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-2 flex-1"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="font-bold leading-none" style={{ fontSize: 22, color: "var(--text-default)" }}>
        {value}
      </p>
      {sub && <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-hover)" }}
      >
        <Icon size={14} style={{ color: "var(--text-muted)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-default)" }}>{value}</p>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  iconColor,
  label,
  description,
  right,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KassaProfile() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { lang, changeLanguage } = useTranslation();

  const emp = DEMO_CASHIER;
  const kassa = DEMO_KASSA;
  const core = emp.statsUser?.core;
  const roleStats = emp.statsUser?.roleStats as CashierStats | undefined;

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  const langs: { value: Lang; label: string }[] = [
    { value: "uz", label: "UZ" },
    { value: "ru", label: "RU" },
  ];

  return (
    <div className="p-4 tablet:p-6 space-y-4 pb-6">

      {/* ── Avatar + ism ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        {/* Top gradient strip */}
        <div className="h-16 w-full" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }} />

        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-8 mb-3">
            <img
              src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
              alt={emp.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 shrink-0"
              style={{ borderColor: "var(--bg-second)" }}
            />
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold"
                style={{ background: "#3b82f620", color: "#60a5fa" }}
              >
                Kassir
              </span>
              <span
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold"
                style={{
                  background: emp.status === EmployeeStatus.ACTIVE ? "#22c55e20" : "#ef444420",
                  color: emp.status === EmployeeStatus.ACTIVE ? "#4ade80" : "#f87171",
                }}
              >
                {emp.status === EmployeeStatus.ACTIVE ? "Faol" : "Nofaol"}
              </span>
            </div>
          </div>

          {/* Name */}
          <p className="font-bold text-lg leading-none" style={{ color: "var(--text-default)" }}>
            {emp.fullName}
          </p>
          {emp.age && (
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {emp.age} yosh
            </p>
          )}

          {/* Divider */}
          <div className="my-3" style={{ borderTop: "1px solid var(--border-default)" }} />

          {/* Contact info */}
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {emp.phone && <InfoRow icon={LuPhone} label="Telefon" value={emp.phone} />}
            {emp.telegram_username && <InfoRow icon={LuSend} label="Telegram" value={emp.telegram_username} />}
            <InfoRow icon={LuBriefcase} label="Kassa" value={`${kassa.name} — ${kassa.location}`} />
            <InfoRow icon={LuCalendar} label="Ishga kirgan" value={emp.createdAt} />
          </div>
        </div>
      </div>

      {/* ── Bugungi statistika ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={LuBanknote}
          label="Bugungi tushum"
          value={fmt(roleStats?.revenueToday ?? 0)}
          sub="so'm"
          color="#3b82f6"
        />
        <StatCard
          icon={LuTicket}
          label="Sotilgan chiptalar"
          value={String(roleStats?.ticketsSoldToday ?? 0)}
          sub="bugun"
          color="#8b5cf6"
        />
        <StatCard
          icon={LuClock}
          label="Ishlagan vaqt"
          value={fmtMinutes(core?.workedTodayMinutes ?? 0)}
          sub={core?.checkIn ? `Kirish: ${core.checkIn}` : undefined}
          color="#22c55e"
        />
        <StatCard
          icon={LuActivity}
          label="Samaradorlik"
          value={`${core?.efficiency ?? 0}%`}
          sub={`Davomat: ${core?.attendanceRate ?? 0}%`}
          color="#f97316"
        />
      </div>

      {/* ── Sozlamalar ────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border px-5"
        style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
      >
        <SettingRow
          icon={LuMoon}
          iconColor="#8b5cf6"
          label="Qorong'i rejim"
          description="Interfeys rangini o'zgartirish"
          right={
            <CusSwitch
              checked={theme === "dark"}
              onCheckedChange={toggle}
              size="md"
            />
          }
        />
        <div style={{ borderTop: "1px solid var(--border-default)" }} />
        <SettingRow
          icon={LuGlobe}
          iconColor="#06b6d4"
          label="Til"
          description="Interfeys tilini tanlang"
          right={
            <div className="flex gap-1">
              {langs.map((l) => (
                <button
                  key={l.value}
                  onClick={() => changeLanguage(l.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    border: lang === l.value ? "1px solid #3b82f6" : "1px solid var(--border-default)",
                    background: lang === l.value ? "#3b82f620" : "transparent",
                    color: lang === l.value ? "#60a5fa" : "var(--text-muted)",
                  }}
                >
                  {l.value.toUpperCase()}
                </button>
              ))}
            </div>
          }
        />
      </div>

      {/* ── Chiqish ───────────────────────────────────────────────────────── */}
     

    </div>
  );
}
