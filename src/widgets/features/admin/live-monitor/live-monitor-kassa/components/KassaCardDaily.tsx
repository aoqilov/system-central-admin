import { LuBanknote, LuClock, LuInfo, LuUser } from "react-icons/lu";
import {
  CusCard,
  CusCardHeader,
} from "../../../../../../components/shared/card/CusCard";

export interface KassaReport {
  kassaNumber: number;
  shiftStartedAt: string;
  employee: string;
  status: "active" | "inactive" | "stop";
  description?: string;
  payments: { naxt: number; karta: number };
  providers: { uzumBank: number; click: number; payme: number };
  cardsSold: number;
  cardsRegistered: number;
}

const STATUS_CFG = {
  active:   { label: "Faol",              color: "var(--color-green)"  },
  inactive: { label: "Nofaol",            color: "var(--color-red)"    },
  stop:     { label: "To'xtatildi",       color: "var(--color-yellow)" },
} as const;

const fmt = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)} mln` : v.toLocaleString();

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span
        className="text-sm font-semibold tabular-nums"
        style={{ color: color ?? "var(--text-default)" }}
      >
        {value}
      </span>
    </div>
  );
}

export function KassaCardDaily({ data }: { data: KassaReport }) {
  const st = STATUS_CFG[data.status];

  return (
    <CusCard className="overflow-hidden">
      <CusCardHeader
        icon={LuBanknote}
        title={`Kassa #${data.kassaNumber}`}
        iconColor="var(--color-blue)"
        action={
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: `color-mix(in srgb, ${st.color} 12%, transparent)`,
              color: st.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: st.color }}
            />
            {st.label}
          </span>
        }
      />

      <div className="px-4 py-3 flex flex-col gap-0.5">
        {/* Info */}
        <div
          className="flex items-center justify-between pb-3 mb-1 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-1.5">
            <LuClock size={12} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--text-2)" }}>
              {data.shiftStartedAt}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <LuUser size={12} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              {data.employee}
            </span>
          </div>
        </div>

        {/* Payments */}
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
          Оплаты
        </p>
        <Row label="Наличные" value={`${fmt(data.payments.naxt)} so'm`} color="var(--color-green)" />
        <Row label="Карта" value={`${fmt(data.payments.karta)} so'm`} color="var(--color-purple)" />

        <div className="my-2 border-t" style={{ borderColor: "var(--border-default)" }} />

        {/* Providers */}
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-muted)" }}>
          Платёжные системы
        </p>
        <Row label="UzumBank" value={`${fmt(data.providers.uzumBank)} so'm`} color="#f97316" />
        <Row label="Click" value={`${fmt(data.providers.click)} so'm`} color="#1a73e8" />
        <Row label="Payme" value={`${fmt(data.providers.payme)} so'm`} color="#1fce6b" />

        <div className="my-2 border-t" style={{ borderColor: "var(--border-default)" }} />

        {/* Cards footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Карт продано</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-blue)" }}>{data.cardsSold}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Зарегистрировано</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-cyan)" }}>{data.cardsRegistered}</span>
        </div>

        {data.status === "stop" && data.description && (
          <div
            className="flex items-start gap-2 mt-2 p-2.5 rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--color-yellow) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-yellow) 25%, transparent)",
            }}
          >
            <LuInfo size={13} className="shrink-0 mt-0.5" style={{ color: "var(--color-yellow)" }} />
            <p className="text-xs leading-relaxed break-words w-full" style={{ color: "var(--color-yellow)" }}>
              {data.description}
            </p>
          </div>
        )}
      </div>
    </CusCard>
  );
}

const KASSAS: KassaReport[] = [
  {
    kassaNumber: 1,
    shiftStartedAt: "08:00",
    employee: "Aziz Nazarov",
    status: "active",
    payments: { naxt: 2_100_000, karta: 2_750_000 },
    providers: { uzumBank: 1_200_000, click: 900_000, payme: 650_000 },
    cardsSold: 58,
    cardsRegistered: 21,
  },
  {
    kassaNumber: 2,
    shiftStartedAt: "08:00",
    employee: "Dilnoza Mirzayeva",
    status: "active",
    payments: { naxt: 1_800_000, karta: 1_410_000 },
    providers: { uzumBank: 700_000, click: 480_000, payme: 230_000 },
    cardsSold: 44,
    cardsRegistered: 13,
  },
  {
    kassaNumber: 3,
    shiftStartedAt: "09:00",
    employee: "Sherzod Toshmatov",
    status: "active",
    payments: { naxt: 950_000, karta: 2_200_000 },
    providers: { uzumBank: 1_100_000, click: 620_000, payme: 480_000 },
    cardsSold: 37,
    cardsRegistered: 18,
  },
  {
    kassaNumber: 4,
    shiftStartedAt: "09:00",
    employee: "Jasur Karimov",
    status: "active",
    payments: { naxt: 1_450_000, karta: 1_190_000 },
    providers: { uzumBank: 540_000, click: 390_000, payme: 260_000 },
    cardsSold: 31,
    cardsRegistered: 9,
  },
  {
    kassaNumber: 5,
    shiftStartedAt: "09:00",
    employee: "Ali Valiyev",
    status: "active",
    payments: { naxt: 1_250_000, karta: 3_400_000 },
    providers: { uzumBank: 1_200_000, click: 900_000, payme: 1_300_000 },
    cardsSold: 42,
    cardsRegistered: 17,
  },
  {
    kassaNumber: 6,
    shiftStartedAt: "10:00",
    employee: "Feruza Olimova",
    status: "stop",
    description: "Техническое обслуживание. Временно приостановлена до 14:00.",
    payments: { naxt: 320_000, karta: 150_000 },
    providers: { uzumBank: 100_000, click: 50_000, payme: 0 },
    cardsSold: 8,
    cardsRegistered: 3,
  },
  {
    kassaNumber: 7,
    shiftStartedAt: "—",
    employee: "—",
    status: "inactive",
    payments: { naxt: 0, karta: 0 },
    providers: { uzumBank: 0, click: 0, payme: 0 },
    cardsSold: 0,
    cardsRegistered: 0,
  },
];

export function KassaCardDailyList() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          Kassalar kunlik holati
        </p>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {KASSAS.length} ta kassa
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {KASSAS.map((k) => (
          <div
            key={k.kassaNumber}
            className="w-[270px] shrink-0 snap-start"
          >
            <KassaCardDaily data={k} />
          </div>
        ))}
      </div>
    </div>
  );
}
