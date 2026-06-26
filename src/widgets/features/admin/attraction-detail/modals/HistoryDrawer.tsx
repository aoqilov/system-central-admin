import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/widgets/api-global/files-route/filesApi";
import type { AttractionOperatorDetail } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  operator: AttractionOperatorDetail | null;
}

export function HistoryDrawer({ open, onClose, operator }: Props) {
  return (
    <CusDrawer open={open} onClose={onClose} title="История операторов" placement="end" size="md">
      <div className="space-y-6">
        <div>
          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ color: "var(--text-muted)", letterSpacing: "0.07em" }}
          >
            Текущее состояние
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Основной оператор */}
            <div
              className="rounded-lg p-3.5 border"
              style={{ borderColor: "var(--border-default)", background: "var(--bg-hover)" }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
                Основной оператор
              </p>
              {operator ? (
                <div className="flex items-center gap-2">
                  {operator.file ? (
                    <CusImagePreview
                      src={getFileUrl(operator.file)}
                      alt={`${operator.firstname} ${operator.lastname}`}
                      width={28}
                      height={28}
                      borderRadius="50%"
                      objectFit="cover"
                      preview={false}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "var(--bg-input)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>
                        {operator.firstname?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-default)" }}>
                    {operator.firstname} {operator.lastname}
                  </p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Не назначен
                </p>
              )}
            </div>

            {/* Помощники */}
            <div
              className="rounded-lg p-3.5 border"
              style={{ borderColor: "var(--border-default)", background: "var(--bg-hover)" }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
                Помощники
              </p>
              {(operator?.assistant_operators?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  {operator!.assistant_operators.map((a) => (
                    <div key={a.id} className="flex items-center gap-2">
                      {a.file ? (
                        <CusImagePreview
                          src={getFileUrl(a.file)}
                          alt={`${a.firstname} ${a.lastname}`}
                          width={24}
                          height={24}
                          borderRadius="50%"
                          objectFit="cover"
                          preview={false}
                        />
                      ) : (
                        <div
                          style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: "var(--bg-input)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)" }}>
                            {a.firstname?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-tight" style={{ color: "var(--text-default)" }}>
                        {a.firstname} {a.lastname}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Нет
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CusDrawer>
  );
}
