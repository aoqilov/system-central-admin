import { LuMoon, LuGlobe } from "react-icons/lu";
import { MdDeviceUnknown } from "react-icons/md";
import type { Lang } from "@/i18n/languageConfig";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import { SettingRow } from "./SettingRow";
import { useDeviceId } from "@/hooks/useDeviceId";

const LANGS: { value: Lang; label: string }[] = [
  { value: "uz", label: "UZ" },
  { value: "ru", label: "RU" },
];

interface SettingsCardProps {
  theme: string;
  toggle: () => void;
  lang: Lang;
  changeLanguage: (lang: Lang) => void;
}

export function SettingsCard({
  theme,
  toggle,
  lang,
  changeLanguage,
}: SettingsCardProps) {
  const deviceId = useDeviceId("dntdiOP");
  console.log("Device ID:", deviceId);

  return (
    <div
      className="rounded-2xl border px-5"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <SettingRow
        icon={LuMoon}
        iconColor="#8b5cf6"
        label="Qorong'i rejim"
        description="Interfeys rangini o'zgartirish"
        right={
          <CusSwitch
            checked={theme === "dark"}
            onCheckedChange={toggle}
            size="md"
          />
        }
      />
      <div style={{ borderTop: "1px solid var(--border-default)" }} />
      <SettingRow
        icon={LuGlobe}
        iconColor="#06b6d4"
        label="Til"
        description="Interfeys tilini tanlang"
        right={
          <div className="flex gap-1">
            {LANGS.map((l) => (
              <button
                key={l.value}
                onClick={() => changeLanguage(l.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border:
                    lang === l.value
                      ? "1px solid #3b82f6"
                      : "1px solid var(--border-default)",
                  background: lang === l.value ? "#3b82f620" : "transparent",
                  color: lang === l.value ? "#60a5fa" : "var(--text-muted)",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        }
      />
      <div style={{ borderTop: "1px solid var(--border-default)" }} />
      <SettingRow
        icon={MdDeviceUnknown}
        iconColor="#06b"
        label="Device ID"
        description="Уникальный идентификатор устройства"
        right={<span className="font-mono text-sm">{deviceId}</span>}
      />
    </div>
  );
}
