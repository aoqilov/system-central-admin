import React, { useState } from "react";
import {
  LuPlay,
  LuUsers,
  LuBanknote,
  LuPower,
  LuPowerOff,
  LuWifi,
  LuWifiOff,
  LuStar,
  LuUserCheck,
  LuShield,
  LuClock,
  LuCalendarDays,
  LuHash,
  LuUser,
  LuPause,
  LuTriangleAlert,
  LuCirclePlay,
} from "react-icons/lu";
import { Dialog } from "@chakra-ui/react";
import dayjs from "dayjs";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { fmt, type CardCounts, type Round, type SmenaInfo } from "../types";

// ─── Mock operators ───────────────────────────────────────────────────────────

const OPERATORS = [
  { label: "Ahmad Karimov",    value: "Ahmad Karimov"    },
  { label: "Jasur Toshmatov",  value: "Jasur Toshmatov"  },
  { label: "Dilnoza Nazarova", value: "Dilnoza Nazarova" },
  { label: "Sardor Rahimov",   value: "Sardor Rahimov"   },
  { label: "Malika Yusupova",  value: "Malika Yusupova"  },
];

// ─── Card cols ────────────────────────────────────────────────────────────────

const CARD_COLS: { key: keyof CardCounts; label: string; color: string; icon: React.ElementType }[] = [
  { key: "jami",      label: "Jami",       color: "var(--text-default)", icon: LuUsers     },
  { key: "asosiy",    label: "Offline",    color: "#3b82f6",             icon: LuWifiOff   },
  { key: "online",    label: "Online",     color: "#8b5cf6",             icon: LuWifi      },
  { key: "vip",       label: "VIP",        color: "#eab308",             icon: LuStar      },
  { key: "mehmon",    label: "Mehmon",     color: "#06b6d4",             icon: LuUserCheck },
  { key: "parkXodim", label: "Park xodim", color: "#22c55e",             icon: LuShield    },
];

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between py-2.5 border-b last:border-0"
      style={{ borderColor: "var(--border-default)" }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: "var(--text-muted)" }} />
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
      </div>
      <span className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>{value}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  attractionName: string;
  smenaOpen: boolean;
  smenaInfo: SmenaInfo;
  rounds: Round[];
  paused: boolean;
  pauseReason: string;
  onOpen: (operatorName: string) => void;
  onClose: () => void;
  onPause: (reason: string) => void;
  onResume: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AttractionSmenaCard({
  attractionName,
  smenaOpen,
  smenaInfo,
  rounds,
  paused,
  pauseReason,
  onOpen,
  onClose,
  onPause,
  onResume,
}: Props) {
  const [openDialog, setOpenDialog]   = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);
  const [pauseDialog, setPauseDialog] = useState(false);
  const [operator, setOperator]       = useState("");
  const [reason, setReason]           = useState("");

  const now  = dayjs();
  const sana = now.format("DD.MM.YYYY");
  const vaqt = now.format("HH:mm");

  const totalRevenue = rounds.reduce((s, r) => s + r.total, 0);

  function confirmOpen() {
    if (!operator) return;
    onOpen(operator);
    setOpenDialog(false);
  }

  function confirmClose() {
    onClose();
    setCloseDialog(false);
  }

  function confirmPause() {
    if (!reason.trim()) return;
    onPause(reason.trim());
    setPauseDialog(false);
    setReason("");
  }

  return (
    <>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: paused ? "#eab30850" : "var(--border-default)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div
            className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
            style={{ background: paused ? "#eab30818" : "#3b82f618" }}
          >
            {paused
              ? <LuPause size={18} style={{ color: "#eab308" }} />
              : <LuPlay  size={18} style={{ color: "#3b82f6" }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate" style={{ fontSize: 16, color: "var(--text-default)" }}>
              {attractionName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {sana} — сегодняшние результаты
            </p>
          </div>

          {/* Tugmalar */}
          <div className="flex items-center gap-2 shrink-0">
            {smenaOpen && (
              paused ? (
                <button
                  onClick={onResume}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95"
                  style={{ background: "#22c55e18", color: "#22c55e", border: "1px solid #22c55e40" }}
                >
                  <LuCirclePlay size={13} />
                  Davom ettirish
                </button>
              ) : (
                <button
                  onClick={() => { setReason(""); setPauseDialog(true); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95"
                  style={{ background: "#eab30818", color: "#eab308", border: "1px solid #eab30840" }}
                >
                  <LuPause size={13} />
                  Toxtatish
                </button>
              )
            )}

            {smenaOpen ? (
              <button
                onClick={() => setCloseDialog(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95"
                style={{ background: "#ef444418", color: "#ef4444", border: "1px solid #ef444440" }}
              >
                <LuPowerOff size={13} />
                Закрыть
              </button>
            ) : (
              <button
                onClick={() => { setOperator(""); setOpenDialog(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all active:scale-95"
                style={{ background: "#22c55e18", color: "#22c55e", border: "1px solid #22c55e40" }}
              >
                <LuPower size={13} />
                Открыть
              </button>
            )}
          </div>
        </div>

        {/* Smena open state */}
        {smenaOpen ? (
          <>
            {/* Smena info row */}
            <div
              className="mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center gap-4"
              style={{ background: "var(--bg-hover)" }}
            >
              <div>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Смена</p>
                <p className="text-sm font-bold" style={{ color: "var(--text-default)" }}>#{smenaInfo.number}</p>
              </div>
              <div className="w-px h-6 shrink-0" style={{ background: "var(--border-default)" }} />
              <div>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Открыта</p>
                <p className="text-sm font-bold font-mono" style={{ color: "var(--text-default)" }}>{smenaInfo.openedAt}</p>
              </div>
              <div className="w-px h-6 shrink-0" style={{ background: "var(--border-default)" }} />
              <div className="min-w-0">
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Оператор</p>
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-default)" }}>{smenaInfo.operatorName}</p>
              </div>
            </div>

            {/* To'xtatilgan banner */}
            {paused ? (
              <div
                className="mx-4 mb-4 rounded-xl border px-4 py-4 flex flex-col gap-3"
                style={{ background: "#eab30810", borderColor: "#eab30840" }}
              >
                <div className="flex items-center gap-2">
                  <LuTriangleAlert size={16} style={{ color: "#eab308" }} />
                  <p className="text-sm font-bold" style={{ color: "#eab308" }}>
                    Attraksiya to'xtatilgan
                  </p>
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  Sabab: {pauseReason}
                </p>
                <div>
                  <CusButton size="sm" colorPalette="green" onClick={onResume}>
                    <LuCirclePlay size={14} /> Davom ettirish
                  </CusButton>
                </div>
              </div>
            ) : (
              /* Stat cards */
              <div className="flex gap-2 px-4 pb-4 border-t pt-3" style={{ borderColor: "var(--border-default)" }}>
                {/* Round card */}
                <div className="flex flex-col gap-1.5 rounded-xl border p-3 flex-1 min-w-0"
                  style={{ background: "var(--bg-main)", borderColor: "var(--border-default)" }}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-muted)" }}>Round</span>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "#60a5fa18" }}>
                      <LuPlay size={11} style={{ color: "#60a5fa" }} />
                    </div>
                  </div>
                  <p className="font-bold leading-none" style={{ fontSize: 20, color: "#60a5fa" }}>{rounds.length}</p>
                </div>

                {/* Per card-type cards */}
                {CARD_COLS.map((c) => {
                  const total = rounds.reduce((s, r) => s + r.cards[c.key], 0);
                  const isDefault = c.color === "var(--text-default)";
                  const col = isDefault ? "#6b7280" : c.color;
                  return (
                    <div key={c.key} className="flex flex-col gap-1.5 rounded-xl border p-3 flex-1 min-w-0"
                      style={{ background: "var(--bg-main)", borderColor: "var(--border-default)" }}>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-muted)" }}>{c.label}</span>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${col}18` }}>
                          <c.icon size={11} style={{ color: col }} />
                        </div>
                      </div>
                      <p className="font-bold leading-none" style={{ fontSize: 20, color: isDefault ? "var(--text-default)" : c.color }}>
                        {total > 0 ? total : "—"}
                      </p>
                    </div>
                  );
                })}

                {/* Jami summa card */}
                <div className="flex flex-col gap-1.5 rounded-xl border p-3 flex-1 min-w-0"
                  style={{ background: "var(--bg-main)", borderColor: "#22c55e40" }}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold truncate" style={{ color: "var(--text-muted)" }}>Jami summa</span>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "#22c55e18" }}>
                      <LuBanknote size={11} style={{ color: "#22c55e" }} />
                    </div>
                  </div>
                  <p className="font-bold leading-none" style={{ fontSize: 18, color: "#22c55e" }}>{fmt(totalRevenue)}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>сум</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className="mx-4 mb-4 px-4 py-4 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-hover)" }}
          >
            <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
              Смена не открыта. Нажмите «Открыть» чтобы начать.
            </p>
          </div>
        )}
      </div>

      {/* ── Smena ochish dialog ── */}
      <CusDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Smenani ochish"
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Bekor qilish</CusButton>
            </Dialog.ActionTrigger>
            <CusButton colorPalette="green" isDisabled={!operator} onClick={confirmOpen}>
              <LuPower size={14} /> Ochish
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <CusSelect
            options={OPERATORS}
            placeholder="Operatorni tanlang"
            label="Operator"
            value={operator}
            onChange={(v: string) => setOperator(v)}
          />
          <div>
            <InfoRow icon={LuCalendarDays} label="Sana"         value={sana} />
            <InfoRow icon={LuClock}        label="Vaqt"         value={vaqt} />
            <InfoRow icon={LuHash}         label="Smena nomeri" value={`#${smenaInfo.number}`} />
          </div>
        </div>
      </CusDialog>

      {/* ── Smena yopish dialog ── */}
      <CusDialog
        open={closeDialog}
        onClose={() => setCloseDialog(false)}
        title="Smenani yopish"
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Bekor qilish</CusButton>
            </Dialog.ActionTrigger>
            <CusButton colorPalette="red" onClick={confirmClose}>
              <LuPowerOff size={14} /> Yopish
            </CusButton>
          </>
        }
      >
        <div>
          <InfoRow icon={LuUser}         label="Operator"     value={smenaInfo.operatorName} />
          <InfoRow icon={LuCalendarDays} label="Sana"         value={sana} />
          <InfoRow icon={LuClock}        label="Ochilgan"     value={smenaInfo.openedAt} />
          <InfoRow icon={LuHash}         label="Smena nomeri" value={`#${smenaInfo.number}`} />
        </div>
      </CusDialog>

      {/* ── Attraksiya toxtatish dialog ── */}
      <CusDialog
        open={pauseDialog}
        onClose={() => setPauseDialog(false)}
        title="Attraksiyani to'xtatish"
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Bekor qilish</CusButton>
            </Dialog.ActionTrigger>
            <CusButton colorPalette="yellow" isDisabled={!reason.trim()} onClick={confirmPause}>
              <LuPause size={14} /> To'xtatish
            </CusButton>
          </>
        }
      >
        <CusTextArea
          label="Sabab"
          isRequired
          placeholder="To'xtatish sababini kiriting..."
          autoresize
          maxH="160px"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </CusDialog>
    </>
  );
}
