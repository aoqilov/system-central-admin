import { LuImage, LuCalendar, LuPencil, LuTrash2, LuHeart, LuEye } from "react-icons/lu";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { fmtDate } from "@/utils/dateUtils";
import type { MemoryItem } from "../marketing-memory.types";

interface Props {
  item: MemoryItem;
  onEdit: (item: MemoryItem) => void;
  onDelete: (item: MemoryItem) => void;
}

export function MemoryRow({ item, onEdit, onDelete }: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        width: 150,
        maxWidth: 150,
        background: "var(--bg-second)",
        border: "1px solid var(--border-default)",
        flexShrink: 0,
      }}
    >
      {/* Image */}
      <div className="relative" style={{ height: 140, flexShrink: 0 }}>
        {item.thumbnail ? (
          <CusImagePreview
            src={item.thumbnail}
            alt={item.title}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--bg-input)" }}
          >
            <LuImage size={24} style={{ color: "var(--text-dim)" }} />
          </div>
        )}

        {/* Edit / Delete overlay */}
        <div className="absolute bottom-1.5 right-1.5 flex gap-1">
          {/* <button
            onClick={() => onEdit(item)}
            className="p-1 rounded-md"
            style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
          >
            <LuPencil size={11} />
          </button> */}
          <button
            onClick={() => onDelete(item)}
            className="p-1 rounded-md"
            style={{ background: "rgba(239,68,68,0.8)", color: "#fff" }}
          >
            <LuTrash2 size={11} />
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-2.5 py-2 flex flex-col gap-1">
        <span
          className="text-xs font-semibold leading-snug"
          style={{
            color: "var(--text-default)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </span>
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <LuCalendar size={10} />
          {fmtDate(item.date)}
        </span>
        <div className="flex items-center justify-between mt-0.5">
          <span className="flex items-center gap-1 text-xs" style={{ color: "#f87171" }}>
            <LuHeart size={11} />
            {item.like_count}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <LuEye size={11} />
            {item.view_count}
          </span>
        </div>
      </div>
    </div>
  );
}
