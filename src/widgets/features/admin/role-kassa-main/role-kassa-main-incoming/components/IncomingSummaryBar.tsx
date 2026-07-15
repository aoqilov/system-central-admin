import { LuSend } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";

interface Props {
  total: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  canSend: boolean;
  isSendPending: boolean;
  onSend: () => void;
}

function Sep() {
  return (
    <div
      className="w-px h-8 shrink-0"
      style={{ background: "var(--border-default)" }}
    />
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: color ?? "var(--text-default)" }}
      >
        {value}
      </p>
    </div>
  );
}

export function IncomingSummaryBar({
  total,
  confirmed,
  cancelled,
  pending,
  canSend,
  isSendPending,
  onSend,
}: Props) {
  return (
    <div
      className="rounded-xl border px-5 py-4 flex items-center gap-5 flex-wrap"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <Stat label="Всего касс"    value={total} />
      <Sep />
      <Stat label="Подтверждено" value={confirmed} color="#22c55e" />
      <Sep />
      <Stat label="Отказ"        value={cancelled} color="#ef4444" />
      <Sep />
      <Stat label="Ожидание"     value={pending}   color="var(--text-3)" />
      <div className="ml-auto">
        <CusButton
          colorPalette="blue"
          isDisabled={!canSend}
          isLoading={isSendPending}
          onClick={onSend}
        >
          <LuSend size={15} />
          Отправить в бухгалтерию
        </CusButton>
      </div>
    </div>
  );
}
