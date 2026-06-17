import { useNavigate } from "react-router-dom";
import {
  LuMoon,
  LuGlobe,
  LuLogOut,
  LuFerrisWheel,
  LuCircleCheck,
  LuCircleAlert,
  LuWrench,
  LuUser,
  LuRuler,
  LuWeight,
  LuClock,
  LuUsers,
  LuArmchair,
} from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation, type Lang } from "../../i18n/languageConfig";
import { clearAuth } from "@/widgets/features/login/api/authApi";
import { CusSwitch } from "../../components/ui/inputs/CusSwitch";
import { employees, EmployeeRole, EmployeeStatus } from "../../data/employees";
import { attractions } from "../../data/attractions";

// ─── Demo: birinchi operator xodim ───────────────────────────────────────────
const DEMO_OPERATOR = employees.find((e) => e.role === EmployeeRole.OPERATOR)!;
const DEMO_ATTRACTION =
  attractions.find(
    (a) => a.relationOperator.mainOperatorId === DEMO_OPERATOR?.id,
  ) ?? attractions[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  open: { icon: LuCircleCheck, color: "#22c55e", label: "Ochiq" },
  maintenance: { icon: LuWrench, color: "#eab308", label: "Ta'mirlashda" },
  closed: { icon: LuCircleAlert, color: "#ef4444", label: "Yopiq" },
};

function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-2)" }}
          >
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OperatorProfile() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { lang, changeLanguage } = useTranslation();

  const emp = DEMO_OPERATOR;
  const att = DEMO_ATTRACTION;
  const attStatus = STATUS_MAP[att.status];
  const StatusIcon = attStatus.icon;

  const todayRevenue = att.statsRevenue?.slice(-1)[0]?.amount ?? 0;

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  const langs: { value: Lang; label: string }[] = [
    { value: "uz", label: "UZ" },
    { value: "ru", label: "RU" },
  ];

  return (
    <div className="p-4 space-y-4 pb-6">
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleLogout}
          className="px-4 flex items-center justify-center gap-3 rounded-2xl font-semibold transition-all active:scale-[0.97]"
          style={{
            height: 56,
            background: "#ef444415",
            color: "#f87171",
            border: "1px solid #ef444430",
            fontSize: 15,
          }}
        >
          <LuLogOut size={18} />
        </button>
      </div>
      {/* ── Avatar + isim ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border px-4 py-3.5 flex items-center gap-3"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <img
          src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
          alt={emp.fullName}
          className="w-11 h-11 rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "var(--text-default)" }}
          >
            {emp.fullName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {emp.phone}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="px-2 py-0.5 rounded-lg text-[11px] font-semibold"
            style={{ background: "#3b82f620", color: "#60a5fa" }}
          >
            Operator
          </span>
          <span
            className="px-2 py-0.5 rounded-lg text-[11px] font-semibold"
            style={{
              background:
                emp.status === EmployeeStatus.ACTIVE
                  ? "#22c55e20"
                  : "#ef444420",
              color:
                emp.status === EmployeeStatus.ACTIVE ? "#4ade80" : "#f87171",
            }}
          >
            {emp.status === EmployeeStatus.ACTIVE ? "Faol" : "Nofaol"}
          </span>
        </div>
      </div>

      {/* ── Attraksion ma'lumoti ───────────────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <LuFerrisWheel size={16} className="text-blue-400 shrink-0" />
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Mening attraksionim
          </p>
        </div>

        {/* Main info */}
        <div
          className="flex items-center gap-4 px-5 py-4 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <img
            src={
              att.images.imageAttractionMain ??
              `https://picsum.photos/seed/${att.id}/200/200`
            }
            alt={att.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0">
            <p
              className="font-bold truncate"
              style={{ fontSize: 18, color: "var(--text-default)" }}
            >
              {att.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <StatusIcon size={13} style={{ color: attStatus.color }} />
              <span
                className="text-xs font-medium"
                style={{ color: attStatus.color }}
              >
                {attStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Rules */}
        {att.rulesAttraction &&
          (() => {
            const r = att.rulesAttraction!;
            const cards = [
              r.minAge != null && {
                icon: LuUser,
                color: "#3b82f6",
                label: "Min. yosh",
                val: r.minAge,
                unit: "yosh",
              },
              r.minHeight && {
                icon: LuRuler,
                color: "#8b5cf6",
                label: "Min. bo'y",
                val: r.minHeight,
                unit: "sm",
              },
              r.maxHeight && {
                icon: LuRuler,
                color: "#a855f7",
                label: "Maks. bo'y",
                val: r.maxHeight,
                unit: "sm",
              },
              r.minWeight && {
                icon: LuWeight,
                color: "#06b6d4",
                label: "Min. vazn",
                val: r.minWeight,
                unit: "kg",
              },
              r.maxWeight && {
                icon: LuWeight,
                color: "#0891b2",
                label: "Maks. vazn",
                val: r.maxWeight,
                unit: "kg",
              },
              {
                icon: LuClock,
                color: "#eab308",
                label: "1 aylanish",
                val: r.roundTime,
                unit: "daq",
              },
              {
                icon: LuUsers,
                color: "#22c55e",
                label: "O'rin/sikl",
                val: r.numberOfPlaceRound,
                unit: "ta",
              },
              r.maxWeightPerCup && {
                icon: LuArmchair,
                color: "#f97316",
                label: "Kubik/vazn",
                val: r.maxWeightPerCup,
                unit: "kg",
              },
              r.maxWeightPerBoat && {
                icon: LuArmchair,
                color: "#ef4444",
                label: "Qayiq/vazn",
                val: r.maxWeightPerBoat,
                unit: "kg",
              },
            ].filter(Boolean) as {
              icon: React.ElementType;
              color: string;
              label: string;
              val: number;
              unit: string;
            }[];

            return (
              <div
                className="px-4 py-3 border-b grid grid-cols-3 gap-2"
                style={{ borderColor: "var(--border-default)" }}
              >
                {cards.map((c) => (
                  <div
                    key={c.label}
                    className="flex flex-col items-center gap-1 rounded-xl py-3"
                    style={{ background: "var(--bg-hover)" }}
                  >
                    <c.icon size={16} style={{ color: c.color }} />
                    <p
                      className="font-bold leading-none"
                      style={{ fontSize: 20, color: "var(--text-default)" }}
                    >
                      {c.val}
                    </p>
                    <p
                      className="text-[12px] text-center leading-tight"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.unit}
                      <br />
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}

        {/* Revenue */}
      </div>

      {/* ── Sozlamalar ────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border px-5"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
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
                    border:
                      lang === l.value
                        ? "1px solid #3b82f6"
                        : "1px solid var(--border-default)",
                    background: lang === l.value ? "#3b82f620" : "transparent",
                    color: lang === l.value ? "#60a5fa" : "var(--text-muted)",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          }
        />
      </div>

      {/* ── Chiqish tugmasi ───────────────────────────────────────────────── */}
    </div>
  );
}
