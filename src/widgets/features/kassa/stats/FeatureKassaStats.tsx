import {
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuRotateCcw,
  LuActivity,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { fmtDateTime } from "@/utils/dateUtils";
import { useKassaStats } from "./hooks/useKassaStats";
import { StatCard, fmt } from "./components/StatCard";
import { HourlyChart } from "./components/HourlyChart";
import { TransactionsTable } from "./components/TransactionsTable";

export default function FeatureKassaStats() {
  const navigate = useNavigate();
  const { activeX, s, op, transactions, txTotal, txLoading, txPage, setTxPage, TX_PAGE_SIZE } =
    useKassaStats();

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-default)" }}>
            Кассовая смена
          </h1>
          {activeX ? (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-lg"
              style={{ background: "#3b82f618", color: "#60a5fa", border: "1px solid #3b82f630" }}
            >
              X-отчёт #{activeX.id}
            </span>
          ) : (
            <span
              className="text-xs px-2 py-0.5 rounded-lg"
              style={{ background: "#f9731618", color: "#fb923c", border: "1px solid #f9731630" }}
            >
              Смена закрыта
            </span>
          )}
          {activeX && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <LuActivity size={12} />
              Активна
            </span>
          )}
        </div>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {activeX
            ? `${op} · Начата: ${fmtDateTime(activeX.opened_at)}`
            : "Смена не открыта. Откройте X-отчёт на странице «Отчёт»."}
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-4 tablet:-mx-6 px-4 tablet:px-6 pb-1">
        <div className="flex gap-3">
          <StatCard icon={LuBanknote}   label="Выручка за день"     value={fmt(s.total)}           sub="сум"     color="#3b82f6" dim={!activeX} />
          <StatCard icon={LuWallet}     label="Наличные"            value={fmt(s.naqd)}            sub="сум"     color="#22c55e" dim={!activeX} />
          <StatCard icon={LuCreditCard} label="UzCard"              value={fmt(s.uzcard)}          sub="сум"     color="#3b82f6" dim={!activeX} />
          <StatCard icon={LuCreditCard} label="Humo"                value={fmt(s.humo)}            sub="сум"     color="#8b5cf6" dim={!activeX} />
          <StatCard icon={LuSmartphone} label="UzumBank"            value={fmt(s.uzumbank)}        sub="сум"     color="#06b6d4" dim={!activeX} />
          <StatCard icon={LuSmartphone} label="Click"               value={fmt(s.click)}           sub="сум"     color="#f97316" dim={!activeX} />
          <StatCard icon={LuSmartphone} label="Payme"               value={fmt(s.payme)}           sub="сум"     color="#ef4444" dim={!activeX} />
          <StatCard icon={LuTrendingUp} label="Карт продано"        value={String(s.kartaSotildi)} sub="сегодня" color="#eab308" dim={!activeX} />
          <StatCard icon={LuUserCheck}  label="Регистраций карт"    value={String(s.kartaReg)}     sub="сегодня" color="#06b6d4" dim={!activeX} />
          <StatCard icon={LuRotateCcw}  label="Возврат карт"        value="0"                      sub="сегодня" color="#ef4444" dim={!activeX} />
        </div>
      </div>

      {/* ── Transactions table ─────────────────────────────── */}
      <TransactionsTable
        hasActiveSmena={!!activeX}
        transactions={transactions}
        txTotal={txTotal}
        txLoading={txLoading}
        txPage={txPage}
        pageSize={TX_PAGE_SIZE}
        onPageChange={setTxPage}
        onGoToOtchet={() => navigate("/rolekassa/otchet")}
      />

      {/* ── Hourly chart ───────────────────────────────────── */}
      <HourlyChart hasActiveSmena={!!activeX} />
    </div>
  );
}
