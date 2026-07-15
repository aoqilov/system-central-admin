import { useNavigate } from "react-router-dom";
import { LuFerrisWheel, LuUnplug } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/i18n/languageConfig";
import { useMe } from "@/api/auth/auth.api";
import { clearAuth } from "../../login/hooks/authApi";
import { useOperatorAttraction } from "../hooks/useOperatorAttraction";
import { ProfileCard } from "./components/ProfileCard";
import { AttractionCard } from "./components/AttractionCard";
import { SettingsCard } from "./components/SettingsCard";

export default function FeatureOperatorProfile() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { lang, changeLanguage } = useTranslation();

  const { data: me } = useMe();
  const { attraction, deviceId, isLoading: attLoading, isError: attError } = useOperatorAttraction();

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div className="p-4 space-y-4 pb-6">
      {me && <ProfileCard emp={me} />}

      {attraction ? (
        <AttractionCard att={attraction} />
      ) : attLoading ? (
        <div
          className="rounded-2xl border px-5 py-4 flex items-center gap-3"
          style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
        >
          <LuFerrisWheel size={18} className="text-blue-400 shrink-0 animate-spin" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Attraksion yuklanmoqda...
          </p>
        </div>
      ) : attError || deviceId ? (
        <div
          className="rounded-2xl border px-5 py-4 flex items-center gap-3"
          style={{
            background: "var(--bg-second)",
            borderColor: "rgba(239,68,68,0.3)",
          }}
        >
          <LuUnplug size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
              Attraksion ulanmagan
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Bu qurilmaga hech qanday attraksion biriktirilmagan
            </p>
          </div>
        </div>
      ) : null}
      <SettingsCard
        theme={theme}
        toggle={toggle}
        lang={lang}
        changeLanguage={changeLanguage}
      />
    </div>
  );
}
