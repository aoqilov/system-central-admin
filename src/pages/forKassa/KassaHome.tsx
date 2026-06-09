import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuScanLine,
  LuQrCode,
  LuCircleCheck,
  LuClock,
  LuHash,
  LuLayers,
  LuBanknote,
  LuPhone,
  LuLink,
  LuX,
  LuTriangleAlert,
} from "react-icons/lu";
import { Dialog } from "@chakra-ui/react";
import { CusInput } from "../../components/ui/inputs/CusInput";
import { CusButton } from "../../components/ui/buttons/CusButton";
import { CusSegment } from "../../components/ui/segment/CusSegment";
import { CusDialog } from "../../components/ui/dialog/CusDialog";
import { useKassa } from "../../context/KassaContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type RightMode = "aktivatsa" | "relation";

interface QrInfo {
  status: "active" | "no-active" | null;
  raqam: string;
  token: string;
  partiya: string;
  amount: string;
}

const EMPTY_QR: QrInfo = { status: null, raqam: "", token: "", partiya: "", amount: "" };

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

function ToastList({ items, onRemove }: { items: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" style={{ minWidth: 280 }}>
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
          style={{
            background: t.type === "success" ? "#166534" : "#7f1d1d",
            border: `1px solid ${t.type === "success" ? "#22c55e40" : "#ef444440"}`,
            color: "#fff",
            animation: "slideIn 0.2s ease",
          }}
        >
          {t.type === "success"
            ? <LuCircleCheck size={16} style={{ color: "#4ade80", flexShrink: 0 }} />
            : <LuX size={16} style={{ color: "#f87171", flexShrink: 0 }} />}
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button onClick={() => onRemove(t.id)} style={{ color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>
            <LuX size={14} />
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }`}</style>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const show = useCallback((message: string, type: ToastItem["type"] = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, remove };
}

// ─── OTP input ────────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(4, " ").slice(0, 4).split("");

  function handleChange(i: number, ch: string) {
    if (!/^\d?$/.test(ch)) return;
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[i] = ch;
    onChange(arr.join(""));
    if (ch && i < 3) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i]?.trim() && i > 0)
      refs.current[i - 1]?.focus();
  }

  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3].map((i) => {
        const filled = digits[i] && digits[i] !== " ";
        return (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1}
            value={filled ? digits[i] : ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-full text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
            style={{
              height: 56,
              background: "var(--bg-input)",
              borderColor: filled ? "#3b82f6" : "var(--border-default)",
              color: "var(--text-default)",
              caretColor: "#3b82f6",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.18)";
            }}
            onBlur={(e) => {
              const f = digits[i] && digits[i] !== " ";
              e.currentTarget.style.borderColor = f ? "#3b82f6" : "var(--border-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        );
      })}
    </div>
  );
}

// ─── QR Info row ─────────────────────────────────────────────────────────────

function QrInfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-medium uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
        <Icon size={11} />{label}
      </p>
      <div
        className="h-8 rounded-lg px-3 flex items-center text-sm font-mono"
        style={{
          background: "var(--bg-hover)",
          color: value ? "var(--text-default)" : "var(--text-dim)",
          border: "1px solid var(--border-default)",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

// ─── Right mode 1: Aktivatsa / To'ldirish ────────────────────────────────────

function AktivatsaPanel({ onSuccess }: { onSuccess: () => void }) {
  const [summa, setSumma] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSumma("");
      onSuccess();
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      <CusInput
        label="Summa"
        placeholder="0"
        type="number"
        value={summa}
        onChange={(e) => setSumma(e.target.value)}
        inputSize="lg"
      />
      <div className="mt-auto pt-2">
        <CusButton
          colorPalette="blue" variant="solid" className="w-full"
          isLoading={loading} loadingText="Bajarilmoqda..."
          onClick={handleSubmit}
        >
          Aktivatsa / To'ldirish
        </CusButton>
      </div>
    </div>
  );
}

// ─── Right mode 2: Userga relation ───────────────────────────────────────────

type RelationStep = "phone" | "otp" | "done";

function RelationPanel({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<RelationStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep("phone");
    setPhone("");
    setOtp("");
  }

  function handleSendSms() {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 900);
  }

  function handleConfirm() {
    if (otp.trim().length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      reset();
      onSuccess();
    }, 900);
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      <CusInput
        label="Client telefon raqami"
        placeholder="+998 __ ___ __ __"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        inputSize="lg"
        leftElement={<LuPhone size={14} style={{ color: "var(--text-muted)" }} />}
        disabled={step === "otp"}
      />

      {step === "otp" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
              Tasdiqlash kodi
            </p>
            <button
              className="text-xs underline"
              style={{ color: "var(--text-muted)" }}
              onClick={() => { setStep("phone"); setOtp(""); }}
            >
              Raqamni o'zgartirish
            </button>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {phone} raqamiga SMS yuborildi
          </p>
          <OtpInput value={otp} onChange={setOtp} />
        </div>
      )}

      <div className="mt-auto pt-2">
        {step === "phone" ? (
          <CusButton
            colorPalette="blue" variant="solid" className="w-full"
            isLoading={loading} loadingText="Yuborilmoqda..."
            onClick={handleSendSms}
          >
            SMS yuborish
          </CusButton>
        ) : (
          <CusButton
            colorPalette="green" variant="solid" className="w-full"
            isLoading={loading} loadingText="Tekshirilmoqda..."
            onClick={handleConfirm}
          >
            <LuLink size={16} /> Tasdiqlash
          </CusButton>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KassaHome() {
  const { smena } = useKassa();
  const navigate = useNavigate();
  const [qrInfo, setQrInfo] = useState<QrInfo>(EMPTY_QR);
  const [checked, setChecked] = useState(false);
  const [rightMode, setRightMode] = useState<RightMode>("aktivatsa");
  const [panelKey, setPanelKey] = useState(0);
  const [warnDismissed, setWarnDismissed] = useState(false);
  const { toasts, show: showToast, remove } = useToast();

  function handleCheckQr() {
    setChecked(true);
    setQrInfo({ status: "active", raqam: "QR-2024-00142", token: "TKN-8F3D-A12C", partiya: "B2-007", amount: "45 000" });
  }

  function handleSuccess(message: string) {
    showToast(message, "success");
    // Reset QR + form for next operation
    setQrInfo(EMPTY_QR);
    setChecked(false);
    setPanelKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col h-full">

      <ToastList items={toasts} onRemove={remove} />

      {/* ── No-smena warning dialog ─────────────────────────── */}
      <CusDialog
        open={!smena && !warnDismissed}
        onClose={() => setWarnDismissed(true)}
        size="sm"
        closeOnBackdrop={false}
        footer={
          <>
            <Dialog.ActionTrigger asChild>
              <CusButton variant="outline" onClick={() => setWarnDismissed(true)}>
                OK
              </CusButton>
            </Dialog.ActionTrigger>
            <CusButton
              colorPalette="blue"
              onClick={() => navigate("/rolekassa/stats")}
            >
              Smena ochishga o'tish
            </CusButton>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "#f9731618" }}
          >
            <LuTriangleAlert size={30} style={{ color: "#fb923c" }} />
          </div>
          <div className="text-center">
            <p
              className="font-semibold text-base"
              style={{ color: "var(--text-default)" }}
            >
              Smena ochilmagan!
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              To'lov qilish uchun avval smena oching.
            </p>
          </div>
        </div>
      </CusDialog>

      {/* ── Page header ─────────────────────────────────────── */}
      <div
        className="px-4 tablet:px-6 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <h1 className="text-xl font-bold" style={{ color: "var(--text-default)" }}>
           Kassa butka #3
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {/* ── Dual panel ──────────────────────────────────────── */}
      <div className="flex flex-col desktop:flex-row flex-1 min-h-0">

        {/* ── Left: QR + info ─────────────────────────────── */}
        <div
          className="flex-1 p-4 tablet:p-6 flex flex-col gap-4 desktop:overflow-y-auto"
          style={{ borderRight: "1px solid var(--border-default)" }}
        >
          <div className="flex gap-4 items-start">
            <div
              className="rounded-2xl flex items-center justify-center shrink-0"
              style={{ width: 180, height: 180, background: "var(--bg-hover)", border: "2px dashed var(--border-default)" }}
            >
              <LuQrCode
                size={checked ? 64 : 48}
                style={{ color: checked ? "#3b82f6" : "var(--text-dim)", opacity: checked ? 0.8 : 1, transition: "all 0.3s" }}
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                QR kodni skanerlang yoki tekshiring
              </p>
              <CusButton colorPalette="blue" variant="outline" onClick={handleCheckQr} className="w-full">
                <LuScanLine size={16} /> CHECK-QR
              </CusButton>

              {qrInfo.status && (
                <div
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: qrInfo.status === "active" ? "#22c55e18" : "#6b728018",
                    border: `1px solid ${qrInfo.status === "active" ? "#22c55e40" : "#6b728040"}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: qrInfo.status === "active" ? "#22c55e25" : "#6b728025" }}
                  >
                    {qrInfo.status === "active"
                      ? <LuCircleCheck size={20} style={{ color: "#22c55e" }} />
                      : <LuClock size={20} style={{ color: "#6b7280" }} />}
                  </div>
                  <div>
                    <p className="font-bold text-base leading-none" style={{ color: qrInfo.status === "active" ? "#22c55e" : "#6b7280" }}>
                      {qrInfo.status === "active" ? "Aktiv" : "Nofaol"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: qrInfo.status === "active" ? "#4ade8099" : "#9ca3af99" }}>
                      {qrInfo.status === "active" ? "QR kod faol holatda" : "QR kod faol emas"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col gap-3"
            style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              QR-Info
            </p>
            <QrInfoRow icon={LuHash}     label="Raqam"   value={qrInfo.raqam} />
            <QrInfoRow icon={LuQrCode}   label="Token"   value={qrInfo.token} />
            <QrInfoRow icon={LuLayers}   label="Partiya" value={qrInfo.partiya} />
            <QrInfoRow icon={LuBanknote} label="Summa"   value={qrInfo.amount ? `${qrInfo.amount} so'm` : ""} />
          </div>
        </div>

        {/* ── Right: segment + mode content ───────────────── */}
        <div className="flex-1 flex flex-col desktop:overflow-y-auto">
          <div
            className="px-4 tablet:px-6 py-3 border-b shrink-0"
            style={{ borderColor: "var(--border-default)" }}
          >
            <CusSegment
              size="sm"
              value={rightMode}
              onValueChange={(v) => { setRightMode(v as RightMode); setPanelKey((k) => k + 1); }}
              items={[
                { id: "aktivatsa", label: "Aktivatsa / To'ldirish" },
                { id: "relation",  label: "Userga relation" },
              ]}
            />
          </div>

          <div className="flex-1 p-4 tablet:p-6 flex flex-col">
            {rightMode === "aktivatsa" && (
              <AktivatsaPanel
                key={panelKey}
                onSuccess={() => handleSuccess("Aktivatsa muvaffaqiyatli bajarildi!")}
              />
            )}
            {rightMode === "relation" && (
              <RelationPanel
                key={panelKey}
                onSuccess={() => handleSuccess("Karta foydalanuvchiga muvaffaqiyatli bog'landi!")}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
