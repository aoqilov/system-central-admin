import {
  LuFerrisWheel,
  LuCircleCheck,
  LuCircleAlert,
  LuWrench,
  LuUser,
  LuRuler,
  LuWeight,
  LuClock,
  LuUsers,
  LuCircleOff,
} from "react-icons/lu";
import type { Attraction } from "@/widgets/features/admin/attractions/types";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";

const STATUS_MAP: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  active: { icon: LuCircleCheck, color: "#22c55e", label: "Faol" },
  inactive: { icon: LuCircleOff, color: "#64748b", label: "Nofaol" },
  maintenance: { icon: LuWrench, color: "#eab308", label: "Ta'mirlashda" },
  closed: { icon: LuCircleAlert, color: "#ef4444", label: "Yopiq" },
};

interface AttractionCardProps {
  att: Attraction;
}

export function AttractionCard({ att }: AttractionCardProps) {
  const status = STATUS_MAP[att.status] ?? STATUS_MAP.inactive;
  const StatusIcon = status.icon;

  const imgSrc = att.main_file
    ? getFileUrl(att.main_file)
    : `https://picsum.photos/seed/${att.id}/200/200`;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <LuFerrisWheel size={16} className="text-blue-400 shrink-0" />
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Mening attraksionim
        </p>
      </div>

      <div
        className="flex items-center gap-4 px-5 py-4 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <img
          src={imgSrc}
          alt={att.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p
            className="font-bold truncate"
            style={{ fontSize: 18, color: "var(--text-default)" }}
          >
            {att.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <StatusIcon size={13} style={{ color: status.color }} />
            <span
              className="text-xs font-medium"
              style={{ color: status.color }}
            >
              {status.label}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p
            className="font-bold leading-none"
            style={{ fontSize: 22, color: "var(--text-default)" }}
          >
            {att.price.toLocaleString("uz-UZ")}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            so'm
          </p>
        </div>
      </div>

      <RulesGrid att={att} />
    </div>
  );
}

function RulesGrid({ att }: { att: Attraction }) {
  const cards = [
    att.age_limit > 0 && {
      icon: LuUser,
      color: "#3b82f6",
      label: "Min. yosh",
      val: att.age_limit,
      unit: "yosh",
    },
    att.min_height > 0 && {
      icon: LuRuler,
      color: "#8b5cf6",
      label: "Min. bo'y",
      val: att.min_height,
      unit: "sm",
    },
    att.max_weight > 0 && {
      icon: LuWeight,
      color: "#0891b2",
      label: "Maks. vazn",
      val: att.max_weight,
      unit: "kg",
    },
    att.duration > 0 && {
      icon: LuClock,
      color: "#eab308",
      label: "1 aylanish",
      val: att.duration,
      unit: "daq",
    },
    att.seats > 0 && {
      icon: LuUsers,
      color: "#22c55e",
      label: "O'rin/sikl",
      val: att.seats,
      unit: "ta",
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    color: string;
    label: string;
    val: number;
    unit: string;
  }[];

  if (cards.length === 0) return null;

  return (
    <div
      className="px-4 py-3 grid grid-cols-3 gap-2"
      style={{ borderColor: "var(--border-default)" }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col items-center gap-1 rounded-xl py-3"
          style={{ background: "var(--bg-hover)" }}
        >
          <c.icon size={16} style={{ color: c.color }} />
          <p
            className="font-bold leading-none"
            style={{ fontSize: 20, color: "var(--text-default)" }}
          >
            {c.val}
          </p>
          <p
            className="text-[12px] text-center leading-tight"
            style={{ color: "var(--text-muted)" }}
          >
            {c.unit}
            <br />
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}
