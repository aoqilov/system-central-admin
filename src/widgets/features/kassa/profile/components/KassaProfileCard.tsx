import type { MeEmployee } from "@/widgets/api-global/files-route/auth";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";

interface Props {
  emp: MeEmployee;
}

export function KassaProfileCard({ emp }: Props) {
  const isActive = emp.status === "active";

  return (
    <div
      className="rounded-2xl border px-4 py-3.5 flex items-center gap-3"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      {emp.file ? (
        <div className="w-11 h-11 shrink-0">
          <CusImagePreview
            src={getFileUrl(emp.file)}
            alt={emp.firstname}
            width={44}
            height={44}
            borderRadius={12}
            preview={true}
          />
        </div>
      ) : (
        <div
          className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white text-base font-bold"
          style={{ background: "#3b82f6" }}
        >
          {emp.firstname?.charAt(0).toUpperCase() ?? "K"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className="font-semibold text-sm truncate"
          style={{ color: "var(--text-default)" }}
        >
          {emp.firstname} {emp.lastname}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {emp.phone_number}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="px-2 py-0.5 rounded-lg text-[11px] font-semibold"
          style={{ background: "#3b82f620", color: "#60a5fa" }}
        >
          Kassir
        </span>
        <span
          className="px-2 py-0.5 rounded-lg text-[11px] font-semibold"
          style={{
            background: isActive ? "#22c55e20" : "#ef444420",
            color: isActive ? "#4ade80" : "#f87171",
          }}
        >
          {isActive ? "Faol" : "Nofaol"}
        </span>
      </div>
    </div>
  );
}
