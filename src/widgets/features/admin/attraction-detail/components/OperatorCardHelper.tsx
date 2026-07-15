import { LuX } from "react-icons/lu";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/api/files/files.api";
import type { AttractionOperatorItem } from "../types";

interface Props {
  assistant: AttractionOperatorItem;
  onRemove?: (operatorId: number) => void;
  isRemoving?: boolean;
}

export function OperatorCardHelper({ assistant, onRemove, isRemoving }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
      style={{ background: "var(--bg-hover)", border: "1px solid var(--border-default)" }}
    >
      {assistant.file ? (
        <CusImagePreview
          src={getFileUrl(assistant.file)}
          alt={assistant.firstname}
          width={40}
          height={40}
          objectFit="cover"
          borderRadius="50%"
        />
      ) : (
        <div
          style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "var(--bg-input)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20, color: "var(--text-muted)",
          }}
        >
          {assistant.firstname?.charAt(0) ?? "?"}
        </div>
      )}
      <p className="flex-1 text-[13px] font-medium" style={{ color: "var(--text-default)" }}>
        {assistant.firstname} {assistant.lastname}
      </p>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(assistant.id)}
          disabled={isRemoving}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 18, height: 18, borderRadius: 4, border: "none", cursor: "pointer",
            background: "transparent", color: "var(--text-muted)",
            opacity: isRemoving ? 0.4 : 1, flexShrink: 0,
          }}
        >
          <LuX size={11} />
        </button>
      )}
    </div>
  );
}
