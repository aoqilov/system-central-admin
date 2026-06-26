import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import type { AssistantOperator } from "../types";

interface Props {
  assistant: AssistantOperator;
}

export function OperatorCardHelper({ assistant }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
      style={{ background: "var(--bg-hover)", border: "1px solid var(--border-default)" }}
    >
      {assistant.file ? (
        <CusImagePreview
          src={getFileUrl(assistant.file)}
          alt={assistant.firstname}
          width={20}
          height={20}
          objectFit="cover"
          borderRadius="50%"
        />
      ) : (
        <div
          style={{
            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
            background: "var(--bg-input)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 10, color: "var(--text-muted)",
          }}
        >
          {assistant.firstname?.charAt(0) ?? "?"}
        </div>
      )}
      <p className="text-[11px] font-medium" style={{ color: "var(--text-default)" }}>
        {assistant.firstname} {assistant.lastname}
      </p>
    </div>
  );
}
