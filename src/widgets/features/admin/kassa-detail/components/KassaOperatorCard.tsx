import { LuX } from "react-icons/lu";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import type { CashboxOperator } from "@/widgets/features/admin/kassa/types";

interface Props {
  operator: CashboxOperator;
  onRemove?: (operatorId: number) => void;
  isRemoving?: boolean;
}

export function KassaOperatorCard({ operator, onRemove, isRemoving }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
      style={{
        background: "var(--bg-hover)",
        border: "1px solid var(--border-default)",
      }}
    >
      {operator.file ? (
        <CusImagePreview
          src={getFileUrl(operator.file)}
          alt={operator.firstname}
          width={40}
          height={40}
          objectFit="cover"
          borderRadius="50%"
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            flexShrink: 0,
            background: "var(--bg-input)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "var(--text-muted)",
          }}
        >
          {operator.firstname?.charAt(0) ?? "?"}
        </div>
      )}
      <p
        className="flex-1 text-[13px] font-medium"
        style={{ color: "var(--text-default)" }}
      >
        {operator.firstname} {operator.lastname}
      </p>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(operator.id)}
          disabled={isRemoving}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "var(--text-muted)",
            opacity: isRemoving ? 0.4 : 1,
            flexShrink: 0,
          }}
        >
          <LuX size={11} />
        </button>
      )}
    </div>
  );
}
