import {
  LuImage,
  LuHistory,
  LuTag,
  LuClock,
  LuLayoutGrid,
  LuUser,
  LuRuler,
  LuWeight,
} from "react-icons/lu";
import type { ElementType } from "react";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusCard as Card } from "@/components/shared/card/CusCard";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/api/files/files.api";
import type { AttractionDetail, AttractionStatus } from "../types";

const STATUS_BADGE: Record<AttractionStatus, "active" | "pending" | "fired"> = {
  active: "active",
  inactive: "fired",
  maintenance: "pending",
  closed: "fired",
};

const STATUS_LABEL: Record<AttractionStatus, string> = {
  active: "Активен",
  inactive: "Неактивен",
  maintenance: "Обслуживание",
  closed: "Закрыт",
};

interface StatItem {
  icon: ElementType;
  label: string;
  value: string;
  color: string;
}

interface Props {
  attraction: AttractionDetail;
  onHistoryOpen: () => void;
}

export function AttractionCard({ attraction, onHistoryOpen }: Props) {
  const mainImgUrl = attraction.main_file ? getFileUrl(attraction.main_file) : null;

  const stats: StatItem[] = [
    { icon: LuTag,        label: "Цена",        value: `${attraction.price.toLocaleString()} сум`, color: "#8b5cf6" },
    { icon: LuClock,      label: "Длительность", value: `${attraction.duration} мин`,              color: "#3b82f6" },
    { icon: LuLayoutGrid, label: "Мест",         value: `${attraction.seats} шт`,                  color: "#22c55e" },
    ...(attraction.age_limit  > 0 ? [{ icon: LuUser,   label: "Мин. возраст", value: `${attraction.age_limit} лет`,  color: "#f59e0b" }] : []),
    ...(attraction.min_height > 0 ? [{ icon: LuRuler,  label: "Мин. рост",    value: `${attraction.min_height} см`,  color: "#ec4899" }] : []),
    ...(attraction.max_weight > 0 ? [{ icon: LuWeight, label: "Макс. вес",    value: `${attraction.max_weight} кг`,  color: "#14b8a6" }] : []),
  ];

  return (
    <Card>
      <div className="flex flex-col desktop:flex-row">
        {/* Image */}
        <div className="shrink-0 h-[220px] desktop:h-auto desktop:w-[260px] desktop:self-stretch overflow-hidden">
          {mainImgUrl ? (
            <CusImagePreview
              src={mainImgUrl}
              alt={attraction.name}
              width="100%"
              height="100%"
              objectFit="cover"
              preview
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "var(--bg-hover)", minHeight: 220 }}
            >
              <LuImage size={32} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="hidden desktop:block shrink-0 w-px self-stretch"
          style={{ background: "var(--border-default)" }}
        />
        <div
          className="desktop:hidden h-px mx-5"
          style={{ background: "var(--border-default)" }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0 p-5 flex flex-col gap-4">
          {/* Name + manufacturer */}
          <div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: "var(--text-default)" }}>
              {attraction.name}
            </h1>
            {attraction.manufacturer && (
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {attraction.manufacturer}
              </p>
            )}
          </div>

          {/* Status + history */}
          <div className="flex items-center gap-2 flex-wrap">
            <CusBadge status={STATUS_BADGE[attraction.status]} size="sm">
              {STATUS_LABEL[attraction.status]}
            </CusBadge>
            <button
              onClick={onHistoryOpen}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors"
              style={{
                color: "var(--text-muted)",
                background: "var(--bg-hover)",
                border: "1px solid var(--border-default)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-input)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              }}
            >
              <LuHistory size={11} />
              История операторов
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 desktop:grid-cols-3 gap-2">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ background: "var(--bg-hover)" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}18` }}
                  >
                    <Icon size={13} style={{ color: s.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {s.label}
                    </p>
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-default)" }}>
                      {s.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
