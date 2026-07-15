import { LuHeart, LuEye, LuCalendar, LuClock, LuImage, LuPencil, LuTrash2 } from "react-icons/lu";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fmtDate } from "@/utils/dateUtils";
import type { NewsItem } from "../marketing-news.types";

interface Props {
  item: NewsItem;
  onEdit: (item: NewsItem) => void;
  onDelete: (item: NewsItem) => void;
}

function isExpiringSoon(expired_at: string): boolean {
  const diff = new Date(expired_at).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
}

function isExpired(expired_at: string): boolean {
  return new Date(expired_at).getTime() < Date.now();
}

export function NewsCard({ item, onEdit, onDelete }: Props) {
  const expiring = isExpiringSoon(item.expired_at);
  const expired = isExpired(item.expired_at);
  const isArchived = item.status === "archived";

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-opacity"
      style={{
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
        opacity: isArchived ? 0.65 : 1,
        maxWidth: 340,
        height: 520,
      }}
    >
      {/* Image */}
      <div className="relative" style={{ height: 190, flexShrink: 0 }}>
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
              background: isArchived ? "var(--bg-hover)" : "var(--bg-input)",
              filter: isArchived ? "grayscale(1)" : "none",
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
          <CusBadge
            colorPalette={isArchived ? "gray" : "green"}
            variant="solid"
            size="sm"
          >
            {isArchived ? "Архив" : "Активна"}
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

        {/* Paragraph */}
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
          {item.paragraph}
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border-default)" }} />

        {/* Stats row */}
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="flex items-center gap-1">
            <LuHeart size={12} />
            {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <LuEye size={12} />
            {item.views}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <LuCalendar size={12} />
            {fmtDate(item.created_at)}
          </span>
        </div>

        {/* Expired at */}
        <div
          className="flex justify-end items-center gap-1 text-xs"
          style={{
            color: expired
              ? "#ef4444"
              : expiring
                ? "#f97316"
                : "var(--text-muted)",
          }}
        >
          <LuClock size={12} />
          <span>
            {expired ? "Истёк: " : "До: "}
            {fmtDate(item.expired_at)}
            {expiring && !expired && " — скоро истекает"}
          </span>
        </div>

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
