import { LuMoon, LuGlobe } from "react-icons/lu";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import { useDeviceId } from "@/hooks/useDeviceId";
import { MdDeviceUnknown } from "react-icons/md";
import type { Lang } from "@/i18n/languageConfig";

const LANGS: { value: Lang; label: string }[] = [
  { value: "uz", label: "UZ" },
  { value: "ru", label: "RU" },
];

function SettingRow({
  icon: Icon,
  iconColor,
  label,
  description,
  right,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

interface Props {
  theme: string;
  toggle: () => void;
  lang: Lang;
  changeLanguage: (lang: Lang) => void;
}

export function KassaSettingsCard({ theme, toggle, lang, changeLanguage }: Props) {
  const deviceId = useDeviceId("dntdiKA");

  return (
    <div
      className="rounded-2xl border px-5"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <SettingRow
        icon={LuMoon}
        iconColor="#8b5cf6"
        label="Qorong'i rejim"
        description="Interfeys rangini o'zgartirish"
        right={<CusSwitch checked={theme === "dark"} onCheckedChange={toggle} size="md" />}
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
                  border: lang === l.value ? "1px solid #3b82f6" : "1px solid var(--border-default)",
                  background: lang === l.value ? "#3b82f620" : "transparent",
                  color: lang === l.value ? "#60a5fa" : "var(--text-muted)",
                }}
              >
                {l.value.toUpperCase()}
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
        right={<span className="font-mono text-sm">{deviceId ?? "—"}</span>}
      />
    </div>
  );
}
