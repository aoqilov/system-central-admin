import { LuLayoutGrid, LuCheck, LuWrench, LuBan } from "react-icons/lu";
import { attractions } from "@/data/attractions";
import { useTranslation } from "@/i18n/languageConfig";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
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
        <p className="text-2xl font-semibold" style={{ color: "var(--text-default)" }}>{value}</p>
      </div>
    </div>
  );
}

export default function AttractionStatCards() {
  const { t } = useTranslation("attractions.");

  const total = attractions.length;
  const openCount = attractions.filter((a) => a.status === "open").length;
  const maintenanceCount = attractions.filter((a) => a.status === "maintenance").length;
  const closedCount = attractions.filter((a) => a.status === "closed").length;

  return (
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      <StatCard label={t("total")} value={total} icon={LuLayoutGrid} color="#3b82f6" />
      <StatCard label={t("open")} value={openCount} icon={LuCheck} color="#22c55e" />
      <StatCard label={t("maintenance")} value={maintenanceCount} icon={LuWrench} color="#f59e0b" />
      <StatCard label={t("closed")} value={closedCount} icon={LuBan} color="#ef4444" />
    </div>
  );
}
