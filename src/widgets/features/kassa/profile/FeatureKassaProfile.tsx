import { LuBanknote, LuUnplug } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/i18n/languageConfig";
import { useMe } from "@/api/auth/auth.api";
import { useCashbox } from "../hooks/useCashbox";
import { KassaProfileCard } from "./components/KassaProfileCard";
import { KassaCashboxCard } from "./components/KassaCashboxCard";
import { KassaSettingsCard } from "./components/KassaSettingsCard";

export default function FeatureKassaProfile() {
  const { theme, toggle } = useTheme();
  const { lang, changeLanguage } = useTranslation();
  const { data: me } = useMe();
  const { cashbox, isLoading: cashboxLoading, isError: cashboxError } = useCashbox();

  return (
    <div className="p-4 tablet:p-6 space-y-4 pb-6">
      {me && <KassaProfileCard emp={me} />}

      {cashbox ? (
        <KassaCashboxCard cashbox={cashbox} />
      ) : cashboxLoading ? (
        <div
          className="rounded-2xl border px-5 py-4 flex items-center gap-3"
          style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
        >
          <LuBanknote size={18} className="text-blue-400 shrink-0 animate-pulse" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Kassa yuklanmoqda...
          </p>
        </div>
      ) : cashboxError ? (
        <div
          className="rounded-2xl border px-5 py-4 flex items-center gap-3"
          style={{ background: "var(--bg-second)", borderColor: "rgba(239,68,68,0.3)" }}
        >
          <LuUnplug size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
              Kassa biriktirilmagan
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Bu qurilmaga hech qanday kassa biriktirilmagan
            </p>
          </div>
        </div>
      ) : null}

      <KassaSettingsCard
        theme={theme}
        toggle={toggle}
        lang={lang}
        changeLanguage={changeLanguage}
      />
    </div>
  );
}
