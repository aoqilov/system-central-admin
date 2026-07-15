import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/api/files/files.api";
import type { AttractionOperatorItem } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  mainOperators: AttractionOperatorItem[];
  helpers: AttractionOperatorItem[];
}

export function HistoryDrawer({ open, onClose, mainOperators, helpers }: Props) {
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
              {mainOperators.length > 0 ? (
                <div className="space-y-2">
                  {mainOperators.map((op) => (
                    <div key={op.id} className="flex items-center gap-2">
                      {op.file ? (
                        <CusImagePreview
                          src={getFileUrl(op.file)}
                          alt={`${op.firstname} ${op.lastname}`}
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
                            {op.firstname?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                      )}
                      <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-default)" }}>
                        {op.firstname} {op.lastname}
                      </p>
                    </div>
                  ))}
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
              {helpers.length > 0 ? (
                <div className="space-y-3">
                  {helpers.map((a) => (
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
