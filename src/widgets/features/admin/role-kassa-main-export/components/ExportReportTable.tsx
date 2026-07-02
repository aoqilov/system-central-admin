import type { PaymentRow } from "../types";
import { colTotal, grandTotal } from "../types";

function fmtNum(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "0";
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface Props {
  rows: PaymentRow[];
  kassas: string[];
  kartaSold: (number | null)[];
  dateLabel: string;
  parkName: string;
}

export function ExportReportTable({
  rows,
  kassas,
  kartaSold,
  dateLabel,
  parkName,
}: Props) {
  const thStyle: React.CSSProperties = {
    background: "var(--bg-hover)",
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "8px 12px",
    borderBottom: "1px solid var(--border-default)",
    borderRight: "1px solid var(--border-default)",
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  const tdStyle: React.CSSProperties = {
    fontSize: 12.5,
    padding: "7px 12px",
    borderBottom: "1px solid var(--border-default)",
    borderRight: "1px solid var(--border-default)",
    whiteSpace: "nowrap",
    color: "var(--text-default)",
  };

  const tdNum: React.CSSProperties = {
    ...tdStyle,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  };

  const totalRowStyle: React.CSSProperties = {
    background: "var(--bg-hover)",
    fontWeight: 700,
  };

  // "Тип оплаты" kolonnasi kichik ekranlarda chapda fix
  const stickyFirst: React.CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 1,
    boxShadow: "2px 0 6px rgba(0,0,0,0.12)",
    borderRight: "2px solid var(--border-2)",
  };

  const kartaSum = kartaSold.reduce<number>((s, n) => s + (n ?? 0), 0);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--border-default)" }}
    >
      {/* Meta */}
      <div
        className="px-5 py-3 border-b"
        style={{
          borderColor: "var(--border-default)",
          background: "var(--bg-second)",
        }}
      >
        <p className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
          Выручка станций по дням
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Название : {parkName} &nbsp;·&nbsp; Дата: {dateLabel}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ background: "var(--bg-second)" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, ...stickyFirst, width: 130, zIndex: 2 }}>
                Тип оплаты
              </th>
              {kassas.map((k) => (
                <th key={k} style={{ ...thStyle, textAlign: "center" }}>
                  {k}
                </th>
              ))}
              <th style={{ ...thStyle, textAlign: "center", borderRight: "none" }}>
                Итого
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const rowTotal = row.kassas.reduce(
                (s, k) => s + (k.noDiscount ?? 0),
                0,
              );
              return (
                <tr key={row.type} style={{ background: "var(--bg-second)" }}>
                  <td
                    style={{
                      ...tdStyle,
                      ...stickyFirst,
                      background: "var(--bg-second)",
                    }}
                  >
                    {row.type}
                  </td>
                  {row.kassas.map((kassa, ki) => (
                    <td
                      key={ki}
                      style={{
                        ...tdNum,
                        color:
                          kassa.noDiscount === null
                            ? "var(--text-dim)"
                            : "var(--text-default)",
                      }}
                    >
                      {fmtNum(kassa.noDiscount)}
                    </td>
                  ))}
                  <td style={{ ...tdNum, fontWeight: 600, borderRight: "none" }}>
                    {fmtNum(rowTotal)}
                  </td>
                </tr>
              );
            })}

            {/* Итого row */}
            <tr style={totalRowStyle}>
              <td
                style={{
                  ...tdStyle,
                  ...totalRowStyle,
                  ...stickyFirst,
                  background: "var(--bg-hover)",
                }}
              >
                Итого
              </td>
              {kassas.map((_, ki) => (
                <td
                  key={ki}
                  style={{ ...tdNum, ...totalRowStyle, color: "#60a5fa" }}
                >
                  {fmtNum(colTotal(rows, ki, "noDiscount"))}
                </td>
              ))}
              <td
                style={{
                  ...tdNum,
                  ...totalRowStyle,
                  color: "#22c55e",
                  borderRight: "none",
                }}
              >
                {fmtNum(grandTotal(rows, "noDiscount"))}
              </td>
            </tr>

            {/* Продано карт row */}
            <tr style={{ background: "var(--bg-main)" }}>
              <td
                style={{
                  ...tdStyle,
                  ...stickyFirst,
                  fontWeight: 600,
                  color: "#eab308",
                  background: "var(--bg-main)",
                }}
              >
                Продано карт
              </td>
              {kartaSold.map((count, ki) => (
                <td
                  key={ki}
                  style={{ ...tdNum, color: "#eab308", fontWeight: 600 }}
                >
                  {count !== null ? `${count} шт.` : "—"}
                </td>
              ))}
              <td
                style={{
                  ...tdNum,
                  fontWeight: 700,
                  color: "#eab308",
                  borderRight: "none",
                }}
              >
                {kartaSum} шт.
              </td>
            </tr>

            {/* Возврат карт row */}
            <tr style={{ background: "var(--bg-main)" }}>
              <td
                style={{
                  ...tdStyle,
                  ...stickyFirst,
                  fontWeight: 600,
                  color: "#ef4444",
                  background: "var(--bg-main)",
                }}
              >
                Возврат карт
              </td>
              {kassas.map((_, ki) => (
                <td key={ki} style={{ ...tdNum, color: "#ef4444", fontWeight: 600 }}>
                  0 шт.
                </td>
              ))}
              <td style={{ ...tdNum, fontWeight: 700, color: "#ef4444", borderRight: "none" }}>
                0 шт.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
