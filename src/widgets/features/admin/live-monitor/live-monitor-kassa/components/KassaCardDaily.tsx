import dayjs from "dayjs";
import { LuBanknote, LuClock, LuInfo, LuUser } from "react-icons/lu";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";
import type { ZReportCashbox, ZReport, ZReportStatus } from "../types";

type CardStatus = "active" | "inactive" | "stop";

function mapStatus(zreport: ZReport | undefined): CardStatus {
  if (!zreport) return "inactive";
  const map: Record<ZReportStatus, CardStatus> = {
    open:      "active",
    stopped:   "stop",
    confirmed: "inactive",
    cancelled: "inactive",
  };
  return map[zreport.status] ?? "inactive";
}

const STATUS_CFG: Record<CardStatus, { label: string; color: string }> = {
  active:   { label: "Активна",     color: "var(--color-green)"  },
  inactive: { label: "Неактивна",   color: "var(--color-red)"    },
  stop:     { label: "Остановлена", color: "var(--color-yellow)" },
};

const fmt = (v: number) => v.toLocaleString("ru-RU");

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-sm font-semibold tabular-nums" style={{ color: color ?? "var(--text-default)" }}>
        {value}
      </span>
    </div>
  );
}

function KassaCardDaily({ cashbox }: { cashbox: ZReportCashbox }) {
  const zr = cashbox.zreports[0];
  const status = mapStatus(zr);
  const st = STATUS_CFG[status];

  return (
    <CusCard className="overflow-hidden">
      <CusCardHeader
        icon={LuBanknote}
        title={cashbox.name || `Касса #${cashbox.id}`}
        iconColor="var(--color-blue)"
        action={
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: `color-mix(in srgb, ${st.color} 12%, transparent)`,
              color: st.color,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
            {st.label}
          </span>
        }
      />

      <div className="px-4 py-3 flex flex-col gap-0.5">
        <div
          className="flex items-center justify-between pb-3 mb-1 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-1.5">
            <LuClock size={12} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--text-2)" }}>
              {zr?.opened_at ? dayjs(zr.opened_at).format("HH:mm") : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <LuUser size={12} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              {zr?.operator ? `${zr.operator.firstname} ${zr.operator.lastname}` : "—"}
            </span>
          </div>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
          Оплаты
        </p>
        <Row label="Наличные" value={`${fmt(zr?.cash_amount ?? 0)} сум`}   color="var(--color-green)" />
        <Row label="UzCard"   value={`${fmt(zr?.uzcard_amount ?? 0)} сум`} color="var(--color-blue)"  />
        <Row label="Humo"     value={`${fmt(zr?.humo_amount ?? 0)} сум`}   color="#38bdf8"            />

        <div className="my-2 border-t" style={{ borderColor: "var(--border-default)" }} />

        <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
          Платёжные системы
        </p>
        <Row label="UzumBank" value={`${fmt(zr?.uzum_amount ?? 0)} сум`}  color="#ec4899" />
        <Row label="Click"    value={`${fmt(zr?.click_amount ?? 0)} сум`} color="#1e40af" />
        <Row label="Payme"    value={`${fmt(zr?.payme_amount ?? 0)} сум`} color="#f97316" />

        <div className="my-2 border-t" style={{ borderColor: "var(--border-default)" }} />

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Карт продано</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-blue)" }}>
            {zr?.activated_cards_count ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Зарегистрировано</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-cyan)" }}>
            {zr?.relationed_cards_count ?? 0}
          </span>
        </div>

        {status === "stop" && cashbox.description && (
          <div
            className="flex items-start gap-2 mt-2 p-2.5 rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--color-yellow) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-yellow) 25%, transparent)",
            }}
          >
            <LuInfo size={13} className="shrink-0 mt-0.5" style={{ color: "var(--color-yellow)" }} />
            <p className="text-xs leading-relaxed break-words w-full" style={{ color: "var(--color-yellow)" }}>
              {cashbox.description}
            </p>
          </div>
        )}
      </div>
    </CusCard>
  );
}

interface ListProps {
  cashboxes: ZReportCashbox[] | undefined;
  isLoading: boolean;
}

export function KassaCardDailyList({ cashboxes, isLoading }: ListProps) {
  const items = cashboxes ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          Состояние касс за сегодня
        </p>
        {!isLoading && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {items.length} касс
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[270px] shrink-0 h-[280px] rounded-2xl animate-pulse"
              style={{ background: "var(--bg-second)", border: "1px solid var(--border-default)" }}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {items.map((cashbox) => (
            <div key={cashbox.id} className="w-[270px] shrink-0 snap-start">
              <KassaCardDaily cashbox={cashbox} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
