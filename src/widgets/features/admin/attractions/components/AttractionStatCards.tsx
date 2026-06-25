import type { ElementType } from "react";
import { LuLayoutGrid, LuCircleCheck, LuCircleOff, LuWrench, LuBan } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { fetchAttractionStats } from "../api/attractionsApi";
import { useTranslation } from "@/i18n/languageConfig";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: number;
  icon: ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 border flex items-center gap-4"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
        {loading ? (
          <div className="h-8 w-12 rounded-md animate-pulse mt-0.5" style={{ background: "var(--bg-hover)" }} />
        ) : (
          <p className="text-2xl font-semibold" style={{ color: "var(--text-default)" }}>{value}</p>
        )}
      </div>
    </div>
  );
}

export default function AttractionStatCards() {
  const { t } = useTranslation("attractions.");
  const { data, isLoading } = useQuery({
    queryKey: ["attraction-stats"],
    queryFn: fetchAttractionStats,
  });

  return (
    <div className="grid grid-cols-2 desktop:grid-cols-5 gap-3">
      <StatCard label={t("total")}       value={data?.attractions ?? 0} icon={LuLayoutGrid}   color="#3b82f6" loading={isLoading} />
      <StatCard label={t("active")}      value={data?.active      ?? 0} icon={LuCircleCheck}  color="#22c55e" loading={isLoading} />
      <StatCard label={t("inactive")}    value={data?.inactive    ?? 0} icon={LuCircleOff}    color="#6b7280" loading={isLoading} />
      <StatCard label={t("maintenance")} value={data?.maintenance ?? 0} icon={LuWrench}       color="#f59e0b" loading={isLoading} />
      <StatCard label={t("closed")}      value={data?.closed      ?? 0} icon={LuBan}          color="#ef4444" loading={isLoading} />
    </div>
  );
}
