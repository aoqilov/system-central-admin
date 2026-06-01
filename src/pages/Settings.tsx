import { useState } from "react";
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
} from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";
import { CusSwitch } from "../components/ui/inputs/CusSwitch";
import { useTranslation, type Lang } from "../i18n/languageConfig";

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
              border: lang === l.value
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--border-default)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
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

  const [notif, setNotif] = useState({ sound: true, email: false, push: true, dailyReport: true });
  const [ops,   setOps]   = useState({ autoClose: true, maintenance: false, guestCheckin: true, capacityAlert: true });
  const [sys,   setSys]   = useState({ autoSave: true, dataSync: true });

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
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-default)" }}>
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

      {/* Notifications */}
      <Section title={t("notifications")}>
        <SettingRow icon={LuBell}       iconColor="#3b82f6" label={t("sound")}       description={t("soundDesc")}       checked={notif.sound}       onChange={() => tog(notif, setNotif, "sound")} />
        <SettingRow icon={LuMail}       iconColor="#06b6d4" label={t("email")}       description={t("emailDesc")}       checked={notif.email}       onChange={() => tog(notif, setNotif, "email")} />
        <SettingRow icon={LuSmartphone} iconColor="#22c55e" label={t("push")}        description={t("pushDesc")}        checked={notif.push}        onChange={() => tog(notif, setNotif, "push")} />
        <SettingRow icon={LuFileText}   iconColor="#eab308" label={t("dailyReport")} description={t("dailyReportDesc")} checked={notif.dailyReport} onChange={() => tog(notif, setNotif, "dailyReport")} last />
      </Section>

      {/* Park Operations */}
      <Section title={t("operations")}>
        <SettingRow icon={LuDoorOpen}     iconColor="#3b82f6" label={t("autoClose")}     description={t("autoCloseDesc")}     checked={ops.autoClose}     onChange={() => tog(ops, setOps, "autoClose")} />
        <SettingRow icon={LuWrench}       iconColor="#ef4444" label={t("maintenance")}    description={t("maintenanceDesc")}   checked={ops.maintenance}   onChange={() => tog(ops, setOps, "maintenance")} />
        <SettingRow icon={LuUsers}        iconColor="#22c55e" label={t("guestCheckin")}   description={t("guestCheckinDesc")} checked={ops.guestCheckin}  onChange={() => tog(ops, setOps, "guestCheckin")} />
        <SettingRow icon={LuTriangleAlert} iconColor="#eab308" label={t("capacityAlert")} description={t("capacityAlertDesc")} checked={ops.capacityAlert} onChange={() => tog(ops, setOps, "capacityAlert")} last />
      </Section>

      {/* System */}
      <Section title={t("system")}>
        <SettingRow icon={LuSave}      iconColor="#3b82f6" label={t("autoSave")} description={t("autoSaveDesc")} checked={sys.autoSave} onChange={() => tog(sys, setSys, "autoSave")} />
        <SettingRow icon={LuRefreshCw} iconColor="#06b6d4" label={t("dataSync")} description={t("dataSyncDesc")} checked={sys.dataSync} onChange={() => tog(sys, setSys, "dataSync")} last />
      </Section>

      {/* Version */}
      <div className="flex items-center gap-2 pt-1" style={{ color: "var(--text-dim)" }}>
        <LuMonitor size={12} />
        <p className="text-xs">{t("version")}</p>
      </div>

    </div>
  );
}
