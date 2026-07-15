import { LuCalendar, LuImage, LuTag, LuPencil, LuTrash2 } from "react-icons/lu";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fmtDate } from "@/utils/dateUtils";
import type { AksiyaItem } from "../marketing-aksiya.types";

interface Props {
  item: AksiyaItem;
  onEdit: (item: AksiyaItem) => void;
  onDelete: (item: AksiyaItem) => void;
}

const STATUS_MAP = {
  active:  { label: "Активна",      colorPalette: "green"  },
  plan:    { label: "Планируется",   colorPalette: "purple" },
  archive: { label: "Архив",         colorPalette: "gray"   },
} as const;

export function AksiyaCard({ item, onEdit, onDelete }: Props) {
  const isArchive = item.status === "archive";
  const badge = STATUS_MAP[item.status];

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-opacity"
      style={{
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
        opacity: isArchive ? 0.65 : 1,
        maxWidth: 340,
        height: 480,
      }}
    >
      {/* Image */}
      <div className="relative" style={{ height: 180, flexShrink: 0 }}>
        {item.main_image ? (
          <CusImagePreview
            src={item.main_image}
            alt={item.title}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{
              background: isArchive ? "var(--bg-hover)" : "var(--bg-input)",
              filter: isArchive ? "grayscale(1)" : "none",
            }}
          >
            <LuImage size={28} style={{ color: "var(--text-dim)" }} />
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              Нет фото
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <CusBadge colorPalette={badge.colorPalette} variant="solid" size="sm">
            {badge.label}
          </CusBadge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <h3
          className="text-sm font-semibold leading-snug"
          style={{
            color: "var(--text-default)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          className="text-xs leading-relaxed"
          style={{
            color: "var(--text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {item.description}
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border-default)" }} />

        {/* Dates */}
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <LuCalendar size={12} />
          <span>
            {fmtDate(item.from)} — {fmtDate(item.to)}
          </span>
        </div>

        {/* Discount */}
        {item.discount > 0 && (
          <div
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: "var(--color-green)" }}
          >
            <LuTag size={12} />
            <span>Скидка {item.discount}%</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="blue"
            leftIcon={<LuPencil size={11} />}
            onClick={() => onEdit(item)}
          >
            Изменить
          </CusButton>
          <CusButton
            size="xs"
            variant="outline"
            colorPalette="red"
            leftIcon={<LuTrash2 size={11} />}
            onClick={() => onDelete(item)}
          >
            Удалить
          </CusButton>
        </div>
      </div>
    </div>
  );
}
