import {
  LuActivity,
  LuClock,
  LuCircleCheck,
  LuPrinter,
  LuX,
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuPlay,
  LuRotateCcw,
} from "react-icons/lu";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { CashboxReport } from "../types";
import { StatCard } from "./StatCard";
import { fmt, reportToPaySummary } from "../otchet.helpers";
import { fmtDate, fmtDateTime } from "@/utils/dateUtils";

interface Props {
  item: CashboxReport;
  onPause: () => void;
  onClose: () => void;
  onPrintCopy: () => void;
  onResume: () => void;
}

export function XOtchetCard({ item, onPause, onClose, onPrintCopy, onResume }: Props) {
  const isActive = item.status === "open";
  const isClosed = item.status === "closed";
  const isStopped = item.status === "stopped";
  const dim = isClosed;
  const s = reportToPaySummary(item);
  const op = `${item.operator.firstname} ${item.operator.lastname}`;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: isActive ? "#22c55e" : "var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{
          borderColor: isActive ? "#22c55e" : "var(--border-default)",
          background: isActive ? "#22c55e20" : "var(--bg-hover)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: isActive ? "#3b82f618" : "var(--bg-second)" }}
        >
          {isActive ? (
            <LuActivity size={14} style={{ color: "#3b82f6" }} />
          ) : (
            <LuCircleCheck size={14} style={{ color: "var(--text-muted)" }} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--text-default)" }}
            >
              X-otchet #{item.id}
            </span>
            <CusBadge
              colorPalette={isActive ? "blue" : "gray"}
              variant="subtle"
              size="sm"
            >
              {isActive ? "Faol" : "Yopilgan"}
            </CusBadge>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5 ">
            <span className=" bg-blue-500 text-xs text-white p-1 rounded-lg">
              {op} · Boshlandi: {fmtDateTime(item.opened_at)}
            </span>
            {item.closed_at && (
              <span className="bg-red-500 text-xs shrink-0 text-white p-1 rounded-lg">
                Yopildi: {fmtDateTime(item.closed_at)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div
        className="overflow-x-auto px-4 pt-4 pb-4"
        style={{ background: "var(--bg-second)" }}
      >
        <div className="flex gap-3">
          <StatCard
            icon={LuBanknote}
            label="Jami daromad"
            value={fmt(s.total)}
            sub="so'm"
            color="#3b82f6"
            dim={dim}
          />
          <StatCard
            icon={LuWallet}
            label="Naqd"
            value={fmt(s.naqd)}
            sub="so'm"
            color="#22c55e"
            dim={dim}
          />
          <StatCard
            icon={LuCreditCard}
            label="UzCard"
            value={fmt(s.uzcard)}
            sub="so'm"
            color="#3b82f6"
            dim={dim}
          />
          <StatCard
            icon={LuCreditCard}
            label="Humo"
            value={fmt(s.humo)}
            sub="so'm"
            color="#8b5cf6"
            dim={dim}
          />
          <StatCard
            icon={LuSmartphone}
            label="UzumBank"
            value={fmt(s.uzumbank)}
            sub="so'm"
            color="#06b6d4"
            dim={dim}
          />
          <StatCard
            icon={LuSmartphone}
            label="Click"
            value={fmt(s.click)}
            sub="so'm"
            color="#f97316"
            dim={dim}
          />
          <StatCard
            icon={LuSmartphone}
            label="Payme"
            value={fmt(s.payme)}
            sub="so'm"
            color="#ef4444"
            dim={dim}
          />
          <StatCard
            icon={LuTrendingUp}
            label="Karta sotildi"
            value={String(s.kartaSotildi)}
            sub="bugun"
            color="#eab308"
            dim={dim}
          />
          <StatCard
            icon={LuUserCheck}
            label="Karta registratsiya"
            value={String(s.kartaReg)}
            sub="bugun"
            color="#06b6d4"
            dim={dim}
          />
          <StatCard
            icon={LuRotateCcw}
            label="Vozvrat karta"
            value="0"
            sub="bugun"
            color="#ef4444"
            dim={dim}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="px-4 py-3 flex items-center gap-2 border-t"
        style={{
          borderColor: "var(--border-default)",
          background: "var(--bg-second)",
        }}
      >
        {isClosed ? (
          <CusButton
            style={{ background: "#666" }}
            variant="solid"
            size="xs"
            onClick={onPrintCopy}
          >
            <LuPrinter size={13} /> X-otchet chop etish copy
          </CusButton>
        ) : isStopped ? (
          <CusButton
            colorPalette="green"
            variant="solid"
            size="xs"
            onClick={onResume}
          >
            <LuPlay size={13} /> Davom ettirish
          </CusButton>
        ) : (
          <>
            <CusButton
              colorPalette="orange"
              variant="solid"
              size="xs"
              onClick={onPause}
            >
              <LuClock size={13} /> To'xtatish
            </CusButton>
            <CusButton
              colorPalette="red"
              variant="solid"
              size="xs"
              onClick={onClose}
            >
              <LuX size={13} /> Yopish
            </CusButton>
          </>
        )}
      </div>
    </div>
  );
}
