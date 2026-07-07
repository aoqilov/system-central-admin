import { LuCreditCard, LuShieldCheck, LuCircleDashed, LuShieldOff } from "react-icons/lu";
import type { NfcAllStats } from "../nfc-all.types";
import { NFC_TYPE_META } from "../nfc-all.types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconColor: string;
  sub?: React.ReactNode;
}

function StatCard({ icon, label, value, iconColor, sub }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: "var(--bg-second)", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--bg-hover)" }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-default)" }}>
        {value.toLocaleString()}
      </p>
      {sub && <div>{sub}</div>}
    </div>
  );
}

interface Props {
  stats: NfcAllStats;
}

export function NfcAllStats({ stats }: Props) {
  const { total, byType } = stats;

  const typeBreakdown = (
    <div className="flex flex-wrap gap-2">
      {(["classic", "vip", "org"] as const).map((t) => (
        <span key={t} className="flex items-center gap-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: NFC_TYPE_META[t].color }}
          />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {NFC_TYPE_META[t].label}: {byType[t].total}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      <StatCard
        icon={<LuCreditCard size={16} />}
        label="Всего карт"
        value={total.total}
        iconColor="var(--color-blue)"
        sub={typeBreakdown}
      />
      <StatCard
        icon={<LuShieldCheck size={16} />}
        label="Активных"
        value={total.active}
        iconColor="var(--color-green)"
        sub={
          <div className="flex flex-wrap gap-2">
            {(["classic", "vip", "org"] as const).map((t) => (
              <span key={t} className="text-xs" style={{ color: "var(--text-muted)" }}>
                {NFC_TYPE_META[t].label}: {byType[t].active}
              </span>
            ))}
          </div>
        }
      />
      <StatCard
        icon={<LuCircleDashed size={16} />}
        label="Не активных"
        value={total.inactive}
        iconColor="#6b7280"
      />
      <StatCard
        icon={<LuShieldOff size={16} />}
        label="Заблок. / Утеряно"
        value={total.blocked + total.lost}
        iconColor="#ef4444"
      />
    </div>
  );
}
