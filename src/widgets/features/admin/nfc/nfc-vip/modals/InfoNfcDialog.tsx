import { LuCreditCard, LuCalendar, LuZap, LuHash, LuLayers, LuUser } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { NfcStatusBadge } from "../components/NfcStatusBadge";
import { fmtDateTime } from "@/utils/dateUtils";
import type { Card } from "../nfc.types";

interface Props {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  batchName?: string;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-hover)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <div className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export function InfoNfcDialog({ open, onClose, card, batchName }: Props) {
  const c = card;

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Информация о карте"
      size="sm"
    >
      {c && (
        <div className="space-y-1">
          {/* Card ID header */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{ background: "var(--bg-main)", border: "1px solid var(--border-default)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-hover)" }}
            >
              <LuCreditCard size={20} style={{ color: "var(--text-dim)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                VIP карта
              </p>
              <p
                className="text-lg font-bold font-mono leading-tight"
                style={{ color: "var(--text-default)" }}
              >
                #{c.id}
              </p>
            </div>
            <NfcStatusBadge status={c.status} />
          </div>

          {/* Info rows */}
          <div className="[&>div:last-child]:border-0">
            <InfoRow
              icon={<LuUser size={15} />}
              label="Кому выдана"
              value={
                c.owner ? (
                  c.owner
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>Не указано</span>
                )
              }
            />
            <InfoRow
              icon={<LuHash size={15} />}
              label="Код карты"
              value={
                <span className="font-mono text-sm">{c.card}</span>
              }
            />
            <InfoRow
              icon={<LuZap size={15} />}
              label="NFC код"
              value={
                <span className="font-mono text-sm tracking-wider">{c.nfc}</span>
              }
            />
            <InfoRow
              icon={<LuLayers size={15} />}
              label="Партия (Batch)"
              value={
                <span>
                  {batchName ?? `Batch ${c.batch}`}
                  <span
                    className="ml-2 text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    #{c.batch}
                  </span>
                </span>
              }
            />
            <InfoRow
              icon={<LuCalendar size={15} />}
              label="Дата создания"
              value={fmtDateTime(c.imported_at)}
            />
            <InfoRow
              icon={<LuZap size={15} />}
              label="Дата активации"
              value={
                c.activatedAt ? (
                  fmtDateTime(c.activatedAt)
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>Не активирована</span>
                )
              }
            />
          </div>
        </div>
      )}
    </CusDialog>
  );
}
