import { useState } from "react";
import dayjs from "dayjs";
import {
  LuPrinter,
  LuPower,
  LuActivity,
  LuClock,
  LuX,
  LuBanknote,
  LuWallet,
  LuCreditCard,
  LuSmartphone,
  LuTrendingUp,
  LuUserCheck,
  LuCircleCheck,
  LuFileText,
} from "react-icons/lu";
import { Dialog } from "@chakra-ui/react";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import CusSelect from "@/components/ui/select/CusSelect";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { useSmena } from "@/context/SmenaContext";

const KASSIR_OPTIONS = [
  { label: "Abdullayev Jasur", value: "Abdullayev Jasur" },
  { label: "Toshmatov Sardor", value: "Toshmatov Sardor" },
  { label: "Nazarova Dilnoza", value: "Nazarova Dilnoza" },
];
const KASSIR_NAME = KASSIR_OPTIONS[0].value;
const KASSA_RAQAMI = 5;
const MOCK_NAQD = 265_000;
const MOCK_UZCARD = 180_000;
const MOCK_HUMO = 110_000;
const MOCK_UZUMBANK = 75_000;
const MOCK_CLICK = 65_000;
const MOCK_PAYME = 80_000;
const MOCK_TX = 12;
const MOCK_KARTA_SOTILDI = 54;
const MOCK_KARTA_REG = 31;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  return n.toLocaleString();
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  dim,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  dim?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-2 transition-opacity flex-shrink-0"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
        opacity: dim ? 0.45 : 1,
        minWidth: 188,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p
        className="font-bold leading-none"
        style={{ fontSize: 22, color: "var(--text-default)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── X-receipt print (80mm) ───────────────────────────────────────────────────

function buildXHtml(item: import("@/context/SmenaContext").XOtchet) {
  const total =
    MOCK_NAQD +
    MOCK_UZCARD +
    MOCK_HUMO +
    MOCK_UZUMBANK +
    MOCK_CLICK +
    MOCK_PAYME;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>X-Otchet</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { width: 80mm; margin: 0; padding: 4mm; font-family: 'Courier New',monospace; font-size: 9pt; color: #000; background: #fff; }
  .c  { text-align: center; }
  .b  { font-weight: bold; }
  .r  { text-align: right; }
  .row { display: flex; justify-content: space-between; font-size: 8.5pt; margin: 2px 0; }
  .sep { border: none; border-top: 1px dashed #000; margin: 6px 0; }
  .stitle { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; color: #444; }
</style>
</head>
<body>
  <div class="c b" style="font-size:13pt;letter-spacing:2px">KASSA X-OTCHET</div>
  <div class="c" style="font-size:8pt;margin-top:3px">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c" style="font-size:8pt">${item.date}</div>
  <hr class="sep">
  <div class="row"><span>Smena</span><span>${item.name}</span></div>
  <div class="row"><span>Xodim</span><span>${item.kassir}</span></div>
  <div class="row"><span>Boshlandi</span><span>${item.startTime}</span></div>
  ${item.endTime ? `<div class="row"><span>Yopildi</span><span>${item.endTime}</span></div>` : ""}
  <hr class="sep">
  <div class="stitle">TO'LOV TURLARI</div>
  <div class="row"><span>Naqd</span><span>${MOCK_NAQD.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzCard</span><span>${MOCK_UZCARD.toLocaleString()} so'm</span></div>
  <div class="row"><span>Humo</span><span>${MOCK_HUMO.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzumBank</span><span>${MOCK_UZUMBANK.toLocaleString()} so'm</span></div>
  <div class="row"><span>Click</span><span>${MOCK_CLICK.toLocaleString()} so'm</span></div>
  <div class="row"><span>Payme</span><span>${MOCK_PAYME.toLocaleString()} so'm</span></div>
  <hr class="sep">
  <div class="row b" style="font-size:10pt"><span>JAMI</span><span>${total.toLocaleString()} so'm</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Tranzaksiyalar</span><span>${MOCK_TX} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta sotildi</span><span>${MOCK_KARTA_SOTILDI} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta reg.</span><span>${MOCK_KARTA_REG} ta</span></div>
  <hr class="sep">
  <div class="c b" style="font-size:8pt;color:#dc2626;letter-spacing:1px;margin-top:4px">SMENA YOPILDI · ${item.endTime ?? ""}</div>
  <div class="c" style="font-size:7.5pt;color:#777;margin-top:5px">${item.date} ${item.endTime ?? ""}</div>
</body>
</html>`;
}

// ─── Z-receipt print ──────────────────────────────────────────────────────────

function buildZHtml(
  date: string,
  closeTime: string,
  startTime: string,
  isCopy = false,
) {
  const total =
    MOCK_NAQD +
    MOCK_UZCARD +
    MOCK_HUMO +
    MOCK_UZUMBANK +
    MOCK_CLICK +
    MOCK_PAYME;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Z-Otchet</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { width: 80mm; margin: 0; padding: 4mm; font-family: 'Courier New',monospace; font-size: 9pt; color: #000; background: #fff; }
  .c  { text-align: center; }
  .b  { font-weight: bold; }
  .row { display: flex; justify-content: space-between; font-size: 8.5pt; margin: 2px 0; }
  .sep { border: none; border-top: 1px dashed #000; margin: 6px 0; }
  .stitle { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; color: #444; }
</style>
</head>
<body>
  <div class="c b" style="font-size:13pt;letter-spacing:2px">KASSA Z-OTCHET</div>
  ${isCopy ? `<div class="c b" style="font-size:9pt;letter-spacing:2px;color:#dc2626;margin-top:2px">*** NUSXA / COPY ***</div>` : ""}
  <div class="c" style="font-size:8pt;margin-top:3px">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c" style="font-size:8pt">${date}</div>
  <hr class="sep">
  <div class="row"><span>Xodim</span><span>${KASSIR_NAME}</span></div>
  <div class="row"><span>Boshlandi</span><span>${startTime}</span></div>
  <div class="row"><span>Yopildi</span><span>${closeTime}</span></div>
  <hr class="sep">
  <div class="stitle">TO'LOV TURLARI</div>
  <div class="row"><span>Naqd</span><span>${MOCK_NAQD.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzCard</span><span>${MOCK_UZCARD.toLocaleString()} so'm</span></div>
  <div class="row"><span>Humo</span><span>${MOCK_HUMO.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzumBank</span><span>${MOCK_UZUMBANK.toLocaleString()} so'm</span></div>
  <div class="row"><span>Click</span><span>${MOCK_CLICK.toLocaleString()} so'm</span></div>
  <div class="row"><span>Payme</span><span>${MOCK_PAYME.toLocaleString()} so'm</span></div>
  <hr class="sep">
  <div class="row b" style="font-size:10pt"><span>JAMI</span><span>${total.toLocaleString()} so'm</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Tranzaksiyalar</span><span>${MOCK_TX} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta sotildi</span><span>${MOCK_KARTA_SOTILDI} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta reg.</span><span>${MOCK_KARTA_REG} ta</span></div>
  <hr class="sep">
  <div class="c b" style="font-size:8pt;color:#dc2626;letter-spacing:1px;margin-top:4px">SMENA YOPILDI · ${closeTime}</div>
  <div class="c" style="font-size:7.5pt;color:#777;margin-top:5px">${date} ${closeTime}</div>
</body>
</html>`;
}

function openPrint(html: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank", "width=400,height=600");
  if (!win) {
    URL.revokeObjectURL(url);
    return;
  }
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
    URL.revokeObjectURL(url);
  }, 300);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeatureKassaOtchet() {
  const {
    list,
    active,
    openXOtchet,
    closeXOtchet,
    pauseXOtchet,
    resumeXOtchet,
    closeAllForZ,
  } = useSmena();

  const [pauseTargetId, setPauseTargetId] = useState<string | null>(null);
  const [pauseReason, setPauseReason] = useState("");
  const [openXDialog, setOpenXDialog] = useState(false);

  const hasClosedX = list.some((item) => item.status === "closed");
  const canCloseZ = hasClosedX && !active;
  const [selectedKassir, setSelectedKassir] = useState<string>(KASSIR_OPTIONS[0].value);
  const [zDialog, setZDialog] = useState(false);

  const date = dayjs().format("DD.MM.YYYY");
  const naqd = active ? MOCK_NAQD : 0;
  const uzcard = active ? MOCK_UZCARD : 0;
  const humo = active ? MOCK_HUMO : 0;
  const uzumbank = active ? MOCK_UZUMBANK : 0;
  const click = active ? MOCK_CLICK : 0;
  const payme = active ? MOCK_PAYME : 0;
  const cashTotal = naqd;
  const cardTotal = uzcard + humo + uzumbank + click + payme;
  const totalRev = cashTotal + cardTotal;
  const txCount = active ? MOCK_TX : 0;

  function handleZPrint() {
    openPrint(
      buildZHtml(date, dayjs().format("HH:mm:ss"), active?.startTime ?? ""),
    );
  }

  function handleZConfirm() {
    closeAllForZ();
    setZDialog(false);
  }

  return (
    <div className="p-4 tablet:p-6 flex flex-col gap-5 pb-6">
      {/* Header */}
      <PageHeader
        title="Kunlik Otchet"
        subtitle="Kunlik otchet ma'lumotlari saqlanadi"
      />

      {/* Stat cards box */}
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
          {list.length > 0 && (
            <CusButton
              colorPalette="red"
              variant="outline"
              size="sm"
              isDisabled={!canCloseZ}
              onClick={() => setZDialog(true)}
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
              value={active ? fmt(totalRev) : "0"}
              sub="so'm"
              color="#3b82f6"
              dim={!active}
            />
            <StatCard
              icon={LuWallet}
              label="Naqd"
              value={active ? fmt(naqd) : "0"}
              sub="so'm"
              color="#22c55e"
              dim={!active}
            />
            <StatCard
              icon={LuCreditCard}
              label="UzCard"
              value={active ? fmt(uzcard) : "0"}
              sub="so'm"
              color="#3b82f6"
              dim={!active}
            />
            <StatCard
              icon={LuCreditCard}
              label="Humo"
              value={active ? fmt(humo) : "0"}
              sub="so'm"
              color="#8b5cf6"
              dim={!active}
            />
            <StatCard
              icon={LuSmartphone}
              label="UzumBank"
              value={active ? fmt(uzumbank) : "0"}
              sub="so'm"
              color="#06b6d4"
              dim={!active}
            />
            <StatCard
              icon={LuSmartphone}
              label="Click"
              value={active ? fmt(click) : "0"}
              sub="so'm"
              color="#f97316"
              dim={!active}
            />
            <StatCard
              icon={LuSmartphone}
              label="Payme"
              value={active ? fmt(payme) : "0"}
              sub="so'm"
              color="#ef4444"
              dim={!active}
            />
            <StatCard
              icon={LuTrendingUp}
              label="Karta sotildi"
              value={active ? String(MOCK_KARTA_SOTILDI) : "0"}
              sub="bugun"
              color="#eab308"
              dim={!active}
            />
            <StatCard
              icon={LuUserCheck}
              label="Karta registratsiya"
              value={active ? String(MOCK_KARTA_REG) : "0"}
              sub="bugun"
              color="#06b6d4"
              dim={!active}
            />
          </div>
        </div>
        <div
          className="px-5 py-3 border-t flex justify-end"
          style={{ borderColor: "var(--border-default)" }}
        >
          <CusButton
            variant="outline"
            size="sm"
            isDisabled={!active}
            onClick={() =>
              openPrint(
                buildZHtml(
                  date,
                  dayjs().format("HH:mm:ss"),
                  active?.startTime ?? "",
                  true,
                ),
              )
            }
          >
            <LuPrinter size={14} /> Copy
          </CusButton>
        </div>
      </div>

      {/* Main box: Z-otchet header + X-otchet list */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        {/* X-otchet list section */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-2)" }}
            >
              X-otchetlar
            </p>
          </div>

          {list.length === 0 ? (
            /* Empty state */
            <div
              className="flex flex-col items-center py-10 gap-3 rounded-xl border"
              style={{
                borderColor: "var(--border-default)",
                background: "var(--bg-hover)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--bg-second)" }}
              >
                <LuFileText size={22} style={{ color: "var(--text-dim)" }} />
              </div>
              <div className="text-center">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-3)" }}
                >
                  X-otchet ochilmagan
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ishni boshlash uchun yangi X-otchet oching
                </p>
              </div>
              <CusButton
                colorPalette="green"
                variant="outline"
                size="sm"
                onClick={() => setOpenXDialog(true)}
              >
                <LuPower size={14} /> X-otchet ochish
              </CusButton>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {list.map((item) => {
                const isActive = item.status === "active";
                const isPaused = item.status === "paused";
                const isClosed = item.status === "closed";
                const dim = isClosed;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border overflow-hidden"
                    style={{
                      borderColor: isActive
                        ? "#3b82f650"
                        : "var(--border-default)",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="px-4 py-3 flex items-center gap-3 border-b"
                      style={{
                        borderColor: isActive
                          ? "#3b82f630"
                          : "var(--border-default)",
                        background: isActive
                          ? "#3b82f608"
                          : isPaused
                            ? "#f9731608"
                            : "var(--bg-hover)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: isActive
                            ? "#3b82f618"
                            : isPaused
                              ? "#f9731618"
                              : "var(--bg-second)",
                        }}
                      >
                        {isActive ? (
                          <LuActivity size={14} style={{ color: "#3b82f6" }} />
                        ) : isPaused ? (
                          <LuClock size={14} style={{ color: "#f97316" }} />
                        ) : (
                          <LuCircleCheck
                            size={14}
                            style={{ color: "var(--text-muted)" }}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-semibold text-sm"
                            style={{ color: "var(--text-default)" }}
                          >
                            {item.name}
                          </span>
                          <CusBadge
                            colorPalette={
                              isActive ? "blue" : isPaused ? "orange" : "gray"
                            }
                            variant="subtle"
                            size="sm"
                          >
                            {isActive
                              ? "Faol"
                              : isPaused
                                ? "To'xtatilgan"
                                : "Yopilgan"}
                          </CusBadge>
                        </div>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.date} · Boshlandi: {item.startTime}
                          {item.endTime && ` · Yopildi: ${item.endTime}`}
                          {" · "}
                          {item.kassir}
                        </p>
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
                          label="Bugungi daromad"
                          value={!dim ? fmt(totalRev) : "0"}
                          sub="so'm"
                          color="#3b82f6"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuWallet}
                          label="Naqd"
                          value={!dim ? fmt(naqd) : "0"}
                          sub="so'm"
                          color="#22c55e"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuCreditCard}
                          label="UzCard"
                          value={!dim ? fmt(uzcard) : "0"}
                          sub="so'm"
                          color="#3b82f6"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuCreditCard}
                          label="Humo"
                          value={!dim ? fmt(humo) : "0"}
                          sub="so'm"
                          color="#8b5cf6"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuSmartphone}
                          label="UzumBank"
                          value={!dim ? fmt(uzumbank) : "0"}
                          sub="so'm"
                          color="#06b6d4"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuSmartphone}
                          label="Click"
                          value={!dim ? fmt(click) : "0"}
                          sub="so'm"
                          color="#f97316"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuSmartphone}
                          label="Payme"
                          value={!dim ? fmt(payme) : "0"}
                          sub="so'm"
                          color="#ef4444"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuTrendingUp}
                          label="Karta sotildi"
                          value={!dim ? String(MOCK_KARTA_SOTILDI) : "0"}
                          sub="bugun"
                          color="#eab308"
                          dim={dim}
                        />
                        <StatCard
                          icon={LuUserCheck}
                          label="Karta registratsiya"
                          value={!dim ? String(MOCK_KARTA_REG) : "0"}
                          sub="bugun"
                          color="#06b6d4"
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
                          colorPalette="blue"
                          variant="outline"
                          size="xs"
                          onClick={() => openPrint(buildXHtml(item))}
                        >
                          <LuPrinter size={13} /> X-otchet chop etish copy
                        </CusButton>
                      ) : (
                        <>
                          {isActive && (
                            <CusButton
                              colorPalette="orange"
                              variant="ghost"
                              size="xs"
                              onClick={() => setPauseTargetId(item.id)}
                            >
                              <LuClock size={13} /> To'xtatish
                            </CusButton>
                          )}
                          {isPaused && (
                            <CusButton
                              colorPalette="green"
                              variant="ghost"
                              size="xs"
                              onClick={() => resumeXOtchet(item.id)}
                            >
                              <LuActivity size={13} /> Davom ettirish
                            </CusButton>
                          )}
                          <CusButton
                            colorPalette="red"
                            variant="ghost"
                            size="xs"
                            onClick={() => closeXOtchet(item.id)}
                          >
                            <LuX size={13} /> Yopish
                          </CusButton>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Open new when nothing is active */}
              {!active && (
                <div className="flex justify-end pt-1">
                  <CusButton
                    colorPalette="green"
                    size="sm"
                    variant="outline"
                    onClick={() => setOpenXDialog(true)}
                  >
                    <LuPower size={13} /> Yangi X-otchet ochish
                  </CusButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── X-otchet ochish dialog ─────────────────────────── */}
      <CusDialog
        open={openXDialog}
        onClose={() => setOpenXDialog(false)}
        title="Yangi X-otchet ochish"
        description="Quyidagi ma'lumotlar bilan yangi X-otchet boshlanadi."
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Bekor qilish</CusButton>
            </Dialog.ActionTrigger>
            <CusButton
              colorPalette="green"
              onClick={() => {
                openXOtchet(selectedKassir);
                setOpenXDialog(false);
              }}
            >
              <LuPower size={15} /> Ochish
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <CusSelect
            label="Kassir"
            options={KASSIR_OPTIONS}
            value={selectedKassir}
            onChange={(v) => setSelectedKassir(v as string)}
            placeholder="Kassirni tanlang"
          />
          {[
            { label: "Sana", value: date },
            { label: "Boshlanish vaqti", value: dayjs().format("HH:mm:ss") },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "var(--border-default)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {row.label}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-default)" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CusDialog>

      {/* ── To'xtatish (pause) dialog ──────────────────────── */}
      <CusDialog
        open={!!pauseTargetId}
        onClose={() => { setPauseTargetId(null); setPauseReason(""); }}
        title="X-otchetni to'xtatish"
        description="X-otchetni to'xtatib turmoqchimisiz? To'xtatilgan vaqtda to'lovlar qabul qilinmaydi."
        size="sm"
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline">Bekor qilish</CusButton>
            </Dialog.ActionTrigger>
            <CusButton
              colorPalette="orange"
              onClick={() => {
                if (pauseTargetId) pauseXOtchet(pauseTargetId);
                setPauseTargetId(null);
                setPauseReason("");
              }}
            >
              <LuClock size={15} /> To'xtatish
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            To'xtatilgan X-otchetni Otchet sahifasidan qayta davom ettirishingiz
            mumkin. Tolov qilish va Smena bo'limlari o'chiriladi.
          </p>
          <CusTextArea
            label="Chiqib ketish sababi"
            placeholder="Sababni yozing..."
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
            rows={3}
          />
        </div>
      </CusDialog>

      {/* ── Z-otchet yakunlash dialog ──────────────────────── */}
      <CusDialog
        open={zDialog}
        onClose={() => setZDialog(false)}
        title="Z-otchet yakunlash"
        description={`${date} uchun kunlik Z-otchet olinadi. Barcha X-otchetlar yopiladi.`}
        size="sm"
        closeOnBackdrop={false}
        footer={
          <>
            <CusButton variant="outline" onClick={handleZPrint}>
              <LuPrinter size={15} /> Chop etish
            </CusButton>
            <CusButton colorPalette="red" onClick={handleZConfirm}>
              <LuX size={15} /> Yakunlash
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col gap-0">
          {[
            {
              label: "Jami daromad",
              value: `${fmt(totalRev)} so'm`,
              bold: true,
            },
            { label: "Naqd", value: `${fmt(naqd)} so'm` },
            { label: "UzCard", value: `${fmt(uzcard)} so'm` },
            { label: "Humo", value: `${fmt(humo)} so'm` },
            { label: "UzumBank", value: `${fmt(uzumbank)} so'm` },
            { label: "Click", value: `${fmt(click)} so'm` },
            { label: "Payme", value: `${fmt(payme)} so'm` },
            { label: "Tranzaksiyalar", value: `${txCount} ta` },
            {
              label: "Karta sotildi",
              value: `${active ? MOCK_KARTA_SOTILDI : 0} ta`,
            },
            {
              label: "Karta registratsiya",
              value: `${active ? MOCK_KARTA_REG : 0} ta`,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "var(--border-default)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {row.label}
              </span>
              <span
                className="text-sm"
                style={{
                  color: "var(--text-default)",
                  fontWeight: row.bold ? 700 : 600,
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CusDialog>
    </div>
  );
}
