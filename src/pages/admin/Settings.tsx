import { useState, useRef, useEffect } from "react";
import {
  LuMoon,
  LuBell,
  LuMail,
  LuSmartphone,
  LuFileText,
  LuDoorOpen,
  LuWrench,
  LuUsers,
  LuTriangleAlert,
  LuSave,
  LuRefreshCw,
  LuMonitor,
  LuGlobe,
  LuAppWindow,
  LuImage,
  LuDatabase,
  LuZap,
  LuRefreshCcwDot,
  LuLock,
  LuX,
} from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";
import { CusSwitch } from "../../components/ui/inputs/CusSwitch";
import { CusButton } from "../../components/ui/buttons/CusButton";
import { useTranslation, type Lang } from "../../i18n/languageConfig";
import {
  isPinEnabled,
  setPin,
  disablePinLock,
} from "../../utils/pinLock";

// ─── PIN Lock Section ─────────────────────────────────────────────────────────

function PinSetDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (pin: string) => void;
}) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setError("");
      setTimeout(() => inputRefs[0].current?.focus(), 80);
    }
  }, [open]);

  function handleChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError("");
    if (digit && idx < 3) inputRefs[idx + 1].current?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const prev = [...digits];
      prev[idx - 1] = "";
      setDigits(prev);
      inputRefs[idx - 1].current?.focus();
    }
  }

  function handleSave() {
    const pin = digits.join("");
    if (pin.length < 4) {
      setError("4 xonali PIN kiriting");
      return;
    }
    onSave(pin);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="relative w-full max-w-xs rounded-2xl p-6 flex flex-col items-center"
        style={{
          background: "var(--bg-second)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg transition-colors hover:opacity-60"
          style={{ color: "var(--text-muted)" }}
        >
          <LuX size={16} />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "#3b82f618" }}
        >
          <LuLock size={22} style={{ color: "#3b82f6" }} />
        </div>

        <p className="text-base font-semibold mb-1" style={{ color: "var(--text-default)" }}>
          PIN kodni o'rnating
        </p>
        <p className="text-xs mb-6 text-center" style={{ color: "var(--text-muted)" }}>
          4 xonali raqam kiriting
        </p>

        {/* Inputs */}
        <div className="flex gap-3 mb-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 text-center text-xl font-bold rounded-xl outline-none transition-all"
              style={{
                background: "var(--bg-main)",
                border: `2px solid ${d ? "#3b82f6" : "var(--border-default)"}`,
                color: "var(--text-default)",
                caretColor: "transparent",
                boxShadow: d ? "0 0 0 3px #3b82f618" : "none",
              }}
            />
          ))}
        </div>

        <p
          className="text-xs h-4 mb-5 transition-opacity"
          style={{ color: "#ef4444", opacity: error ? 1 : 0 }}
        >
          {error || " "}
        </p>

        <div className="flex gap-2 w-full">
          <CusButton variant="outline" onClick={onClose} className="flex-1">
            Bekor qilish
          </CusButton>
          <CusButton
            colorPalette="blue"
            onClick={handleSave}
            className="flex-1"
            isDisabled={digits.some((d) => !d)}
          >
            Saqlash
          </CusButton>
        </div>
      </div>
    </div>
  );
}

function PinLockSection() {
  const [enabled, setEnabled] = useState(() => isPinEnabled());
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleToggle(next: boolean) {
    if (next) {
      setDialogOpen(true);
    } else {
      disablePinLock();
      setEnabled(false);
    }
  }

  function handleSave(pin: string) {
    setPin(pin);
    setEnabled(true);
    setDialogOpen(false);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    if (!isPinEnabled()) setEnabled(false);
  }

  return (
    <>
      <Section title="Xavfsizlik">
        <SettingRow
          icon={LuLock}
          iconColor="#3b82f6"
          label="Ekran bloki"
          description="Ilovani PIN kod bilan himoya qiling"
          checked={enabled}
          onChange={handleToggle}
          last
        />
      </Section>

      <PinSetDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
      />
    </>
  );
}

// ─── PWA Config Section ───────────────────────────────────────────────────────

function KvRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-2.5"
      style={{ borderBottom: "1px solid var(--border-default)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span
        className={`text-xs font-medium ${mono ? "font-mono" : ""}`}
        style={{ color: "var(--text-2)" }}
      >
        {value}
      </span>
    </div>
  );
}

function ColorDot({ hex }: { hex: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-3 h-3 rounded-sm border border-white/10 inline-block shrink-0"
        style={{ background: hex }}
      />
      <span className="font-mono">{hex}</span>
    </span>
  );
}

function PwaConfigSection() {
  return (
    <div className="space-y-3">
      <p
        className="text-xs font-semibold uppercase tracking-wider px-1"
        style={{ color: "var(--text-dim)" }}
      >
        PWA Konfiguratsiya
      </p>

      {/* App info */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-3 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#3b82f618" }}
          >
            <LuAppWindow size={14} style={{ color: "#3b82f6" }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            App ma'lumotlari
          </p>
        </div>
        <div className="px-5 [&>*:last-child]:border-none">
          <KvRow label="Nomi" value="ParkOps Control Center" />
          <KvRow label="Qisqa nomi" value="ParkOps" />
          <KvRow
            label="Tavsif"
            value="Park operatsiyalarini boshqarish tizimi"
          />
          <KvRow label="Mavzu rangi" value={<ColorDot hex="#0b0f17" />} />
          <KvRow label="Fon rangi" value={<ColorDot hex="#0b0f17" />} />
        </div>
      </div>

      {/* Display */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-3 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#8b5cf618" }}
          >
            <LuSmartphone size={14} style={{ color: "#8b5cf6" }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Ko'rsatish rejimi
          </p>
        </div>
        <div className="px-5 [&>*:last-child]:border-none">
          <KvRow
            label="Rejim"
            value={
              <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 font-mono text-[11px]">
                standalone
              </span>
            }
          />
          <KvRow label="Yo'nalish" value="any" mono />
          <KvRow label="Start URL" value="/" mono />
          <KvRow label="Qamrov" value="/" mono />
        </div>
      </div>

      {/* Icons */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-3 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#06b6d418" }}
          >
            <LuImage size={14} style={{ color: "#06b6d4" }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Ikonkalar
          </p>
        </div>
        <div className="px-5 space-y-0 [&>*:last-child]:border-none">
          {[
            {
              file: "icons/icon.svg",
              sizes: "any",
              purpose: "default",
              purposeColor: "#3b82f6",
            },
            {
              file: "icons/icon-maskable.svg",
              sizes: "any",
              purpose: "maskable",
              purposeColor: "#22c55e",
            },
          ].map((ic) => (
            <div
              key={ic.file}
              className="flex items-center justify-between gap-3 py-2.5"
              style={{ borderBottom: "1px solid var(--border-default)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  P
                </div>
                <div>
                  <p
                    className="text-xs font-mono"
                    style={{ color: "var(--text-2)" }}
                  >
                    {ic.file}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    image/svg+xml · {ic.sizes}
                  </p>
                </div>
              </div>
              <span
                className="text-[11px] px-2 py-0.5 rounded font-medium shrink-0"
                style={{
                  background: `${ic.purposeColor}18`,
                  color: ic.purposeColor,
                }}
              >
                {ic.purpose}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cache */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-3 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#eab30818" }}
          >
            <LuDatabase size={14} style={{ color: "#eab308" }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            Kesh (Workbox)
          </p>
        </div>
        <div className="px-5 [&>*:last-child]:border-none">
          <KvRow
            label="Yangilanish"
            value={
              <span className="flex items-center gap-1.5">
                <LuRefreshCcwDot size={11} className="text-blue-400" />
                <span>autoUpdate</span>
              </span>
            }
          />
          <KvRow
            label="Oldindan kesh"
            value={
              <span className="font-mono text-[10px]">
                js · css · html · svg · woff2
              </span>
            }
          />
          <KvRow label="Navigatsiya" value="index.html (fallback)" mono />
          <KvRow
            label="Runtime: Shriftlar"
            value={
              <span className="flex items-center gap-1.5">
                <LuZap size={11} className="text-green-400" />
                <span>CacheFirst · 1 yil</span>
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}

// ─── SettingRow ───────────────────────────────────────────────────────────────

function SettingRow({
  icon: Icon,
  iconColor = "#3b82f6",
  label,
  description,
  checked,
  onChange,
  last = false,
}: {
  icon: React.ElementType;
  iconColor?: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className="flex w-full items-center justify-between py-3.5 gap-4"
      style={last ? {} : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        </div>
      </div>
      <div>
        <CusSwitch checked={checked} onCheckedChange={onChange} size="sm" />
      </div>
    </div>
  );
}

// ─── Language Row ─────────────────────────────────────────────────────────────

function LanguageRow({ last = false }: { last?: boolean }) {
  const { t, lang, changeLanguage } = useTranslation("settings.");

  const langs: { value: Lang; label: string }[] = [
    { value: "uz", label: "UZ" },
    { value: "ru", label: "RU" },
  ];

  return (
    <div
      className="flex w-full items-center justify-between py-3.5 gap-4"
      style={last ? {} : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#06b6d418" }}
        >
          <LuGlobe size={15} style={{ color: "#06b6d4" }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
            {t("languageTitle")}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {t("languageDesc")}
          </p>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        {langs.map((l) => (
          <button
            key={l.value}
            onClick={() => changeLanguage(l.value)}
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              border:
                lang === l.value
                  ? "1px solid #3b82f6"
                  : "1px solid var(--border-default)",
              background: lang === l.value ? "#3b82f620" : "transparent",
              color: lang === l.value ? "#3b82f6" : "var(--text-muted)",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {title}
        </p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Settings() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation("settings.");

  const [notif, setNotif] = useState({
    sound: true,
    email: false,
    push: true,
    dailyReport: true,
  });
  const [ops, setOps] = useState({
    autoClose: true,
    maintenance: false,
    guestCheckin: true,
    capacityAlert: true,
  });
  const [sys, setSys] = useState({ autoSave: true, dataSync: true });

  const tog = <T extends object>(
    obj: T,
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
  ) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-4 tablet:p-6 space-y-4 max-w-2xl">
      {/* Header */}
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          {t("breadcrumb")}
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {t("title")}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* Appearance + Language */}
      <Section title={t("appearance")}>
        <SettingRow
          icon={LuMoon}
          iconColor="#8b5cf6"
          label={t("darkMode")}
          description={t("darkModeDesc")}
          checked={theme === "dark"}
          onChange={toggle}
        />
        <LanguageRow last />
      </Section>

      {/* PIN Lock */}
      <PinLockSection />

      {/* Notifications */}
      <Section title={t("notifications")}>
        <SettingRow
          icon={LuBell}
          iconColor="#3b82f6"
          label={t("sound")}
          description={t("soundDesc")}
          checked={notif.sound}
          onChange={() => tog(notif, setNotif, "sound")}
        />
        <SettingRow
          icon={LuMail}
          iconColor="#06b6d4"
          label={t("email")}
          description={t("emailDesc")}
          checked={notif.email}
          onChange={() => tog(notif, setNotif, "email")}
        />
        <SettingRow
          icon={LuSmartphone}
          iconColor="#22c55e"
          label={t("push")}
          description={t("pushDesc")}
          checked={notif.push}
          onChange={() => tog(notif, setNotif, "push")}
        />
        <SettingRow
          icon={LuFileText}
          iconColor="#eab308"
          label={t("dailyReport")}
          description={t("dailyReportDesc")}
          checked={notif.dailyReport}
          onChange={() => tog(notif, setNotif, "dailyReport")}
          last
        />
      </Section>

      {/* Park Operations */}
      <Section title={t("operations")}>
        <SettingRow
          icon={LuDoorOpen}
          iconColor="#3b82f6"
          label={t("autoClose")}
          description={t("autoCloseDesc")}
          checked={ops.autoClose}
          onChange={() => tog(ops, setOps, "autoClose")}
        />
        <SettingRow
          icon={LuWrench}
          iconColor="#ef4444"
          label={t("maintenance")}
          description={t("maintenanceDesc")}
          checked={ops.maintenance}
          onChange={() => tog(ops, setOps, "maintenance")}
        />
        <SettingRow
          icon={LuUsers}
          iconColor="#22c55e"
          label={t("guestCheckin")}
          description={t("guestCheckinDesc")}
          checked={ops.guestCheckin}
          onChange={() => tog(ops, setOps, "guestCheckin")}
        />
        <SettingRow
          icon={LuTriangleAlert}
          iconColor="#eab308"
          label={t("capacityAlert")}
          description={t("capacityAlertDesc")}
          checked={ops.capacityAlert}
          onChange={() => tog(ops, setOps, "capacityAlert")}
          last
        />
      </Section>

      {/* System */}
      <Section title={t("system")}>
        <SettingRow
          icon={LuSave}
          iconColor="#3b82f6"
          label={t("autoSave")}
          description={t("autoSaveDesc")}
          checked={sys.autoSave}
          onChange={() => tog(sys, setSys, "autoSave")}
        />
        <SettingRow
          icon={LuRefreshCw}
          iconColor="#06b6d4"
          label={t("dataSync")}
          description={t("dataSyncDesc")}
          checked={sys.dataSync}
          onChange={() => tog(sys, setSys, "dataSync")}
          last
        />
      </Section>

      {/* PWA Config */}
      <PwaConfigSection />

      {/* Version */}
      <div
        className="flex items-center gap-2 pt-1"
        style={{ color: "var(--text-dim)" }}
      >
        <LuMonitor size={12} />
        <p className="text-xs">{t("version")}</p>
      </div>
    </div>
  );
}
