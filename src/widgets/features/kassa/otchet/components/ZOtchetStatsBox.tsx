import {
  LuPrinter,
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuRotateCcw,
} from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { StatCard } from "./StatCard";
import { fmt, type PaySummary } from "../otchet.helpers";

interface Props {
  date: string;
  hasActive: boolean;
  hasItems: boolean;
  canCloseZ: boolean;
  summary: PaySummary;
  onZClose: () => void;
  onPrintCopy: () => void;
}

export function ZOtchetStatsBox({
  date,
  hasActive,
  hasItems,
  canCloseZ,
  summary,
  onZClose,
  onPrintCopy,
}: Props) {
  const dim = !hasActive;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p
          className="font-semibold text-sm"
          style={{ color: "var(--text-default)" }}
        >
          Z-otchet ma'lumotlari{" "}
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
            ({date})
          </span>
        </p>
        {hasItems && hasActive && (
          <CusButton
            colorPalette="red"
            variant="solid"
            size="sm"
            isDisabled={!canCloseZ}
            onClick={onZClose}
          >
            <LuPrinter size={14} /> Z-otchetni yopish
          </CusButton>
        )}
      </div>

      <div className="overflow-x-auto px-4 pb-4 pt-4">
        <div className="flex gap-3">
          <StatCard
            icon={LuBanknote}
            label="Bugungi daromad"
            value={fmt(summary.total)}
            sub="so'm"
            color="#3b82f6"
            dim={dim}
          />
          <StatCard
            icon={LuWallet}
            label="Naqd"
            value={fmt(summary.naqd)}
            sub="so'm"
            color="#22c55e"
            dim={dim}
          />
          <StatCard
            icon={LuCreditCard}
            label="UzCard"
            value={fmt(summary.uzcard)}
            sub="so'm"
            color="#3b82f6"
            dim={dim}
          />
          <StatCard
            icon={LuCreditCard}
            label="Humo"
            value={fmt(summary.humo)}
            sub="so'm"
            color="#8b5cf6"
            dim={dim}
          />
          <StatCard
            icon={LuSmartphone}
            label="UzumBank"
            value={fmt(summary.uzumbank)}
            sub="so'm"
            color="#06b6d4"
            dim={dim}
          />
          <StatCard
            icon={LuSmartphone}
            label="Click"
            value={fmt(summary.click)}
            sub="so'm"
            color="#f97316"
            dim={dim}
          />
          <StatCard
            icon={LuSmartphone}
            label="Payme"
            value={fmt(summary.payme)}
            sub="so'm"
            color="#ef4444"
            dim={dim}
          />
          <StatCard
            icon={LuTrendingUp}
            label="Karta sotildi"
            value={String(summary.kartaSotildi)}
            sub="bugun"
            color="#eab308"
            dim={dim}
          />
          <StatCard
            icon={LuUserCheck}
            label="Karta registratsiya"
            value={String(summary.kartaReg)}
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

      <div
        className="px-5 py-3 border-t flex justify-end"
        style={{ borderColor: "var(--border-default)" }}
      >
        <CusButton
          style={{
            background: "#666",
          }}
          variant="solid"
          size="sm"
          onClick={onPrintCopy}
        >
          <LuPrinter size={14} /> Copy
        </CusButton>
      </div>
    </div>
  );
}
