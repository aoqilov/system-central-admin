import dayjs from "dayjs";
import { CusDrawer } from "../../../../../components/ui/dialog/CusDrawer";
import type { Employee } from "../../../../../data/employees";
import type { Attraction } from "../../../../../data/attractions";

interface Props {
  open: boolean;
  onClose: () => void;
  attraction: Attraction;
  operator: Employee | null;
  helpers: { emp: Employee; relationdate: string }[];
  connectedDate: string;
}

export function HistoryDrawer({
  open,
  onClose,
  attraction,
  operator,
  helpers,
  connectedDate,
}: Props) {
  return (
    <CusDrawer open={open} onClose={onClose} title="Operator tarixi" placement="end" size="md">
      <div className="space-y-6">
        <div>
          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ color: "var(--text-muted)", letterSpacing: "0.07em" }}
          >
            Joriy holat
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-lg p-3.5 border"
              style={{ borderColor: "var(--border-default)", background: "var(--bg-hover)" }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
                Asosiy operator
              </p>
              {operator ? (
                <>
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    {attraction.relationOperator.relationDay ?? connectedDate}
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={operator.avatarUrl ?? `https://i.pravatar.cc/150?u=${operator.id}`}
                      alt={operator.fullName ?? operator.firstName}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <p
                      className="text-sm font-medium leading-tight"
                      style={{ color: "var(--text-default)" }}
                    >
                      {operator.fullName ?? `${operator.firstName} ${operator.lastName}`}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Biriktilmagan
                </p>
              )}
            </div>

            <div
              className="rounded-lg p-3.5 border"
              style={{ borderColor: "var(--border-default)", background: "var(--bg-hover)" }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
                Yordamchilar
              </p>
              {helpers.length > 0 ? (
                <div className="space-y-3">
                  {helpers.map(({ emp, relationdate }) => (
                    <div key={emp.id}>
                      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                        {dayjs(relationdate).format("DD.MM.YYYY")} da biriktirilgan
                      </p>
                      <div className="flex items-center gap-2">
                        <img
                          src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
                          alt={emp.fullName ?? emp.firstName}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                        <p className="text-sm leading-tight" style={{ color: "var(--text-default)" }}>
                          {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Yo'q
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CusDrawer>
  );
}
