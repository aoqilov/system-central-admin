import { type AttractionRow, TABLE_COLS, thBase, tdBase, fmt } from "../types";

interface Props {
  rows: AttractionRow[];
}

export function ExportTable({ rows }: Props) {
  const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Все привлечения — экспорт отчёта
        </p>
      </div>

      <div className="overflow-x-auto">
        <table
          style={{ borderCollapse: "collapse", width: "100%", minWidth: 1000 }}
        >
          <thead>
            <tr>
              <th
                rowSpan={2}
                style={{
                  ...thBase,
                  textAlign: "center",
                  paddingLeft: 12,
                  paddingRight: 12,
                  width: 40,
                }}
              >
                #
              </th>
              <th
                rowSpan={2}
                style={{
                  ...thBase,
                  textAlign: "left",
                  paddingLeft: 16,
                  minWidth: 180,
                }}
              >
                Привлечение
              </th>
              <th rowSpan={2} style={{ ...thBase, textAlign: "center" }}>
                Round
              </th>
              <th
                colSpan={TABLE_COLS.length}
                style={{ ...thBase, textAlign: "center", paddingBottom: 16 }}
              >
                Тип карты
              </th>
              <th
                rowSpan={2}
                style={{ ...thBase, textAlign: "right" }}
              >
                Сумма 1×
              </th>
              <th
                rowSpan={2}
                style={{ ...thBase, textAlign: "right", lineHeight: 1.4 }}
              >
                <span style={{ display: "block" }}>Оплачено</span>
                <span
                  style={{
                    display: "block",
                    fontWeight: 400,
                    fontSize: 10,
                    color: "var(--text-dim)",
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (онлайн+офлайн) × цена
                </span>
              </th>
              <th
                rowSpan={2}
                style={{ ...thBase, textAlign: "right", borderRight: "none" }}
              >
                Итого
              </th>
            </tr>
            <tr>
              {TABLE_COLS.map((c) => (
                <th
                  key={c.key}
                  style={{
                    ...thBase,
                    textAlign: "right",
                    color: c.color,
                    paddingTop: 3,
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id}>
                <td
                  style={{
                    ...tdBase,
                    textAlign: "center",
                    color: "var(--text-dim)",
                    fontSize: 12,
                  }}
                >
                  {ri + 1}
                </td>
                <td style={{ ...tdBase, paddingLeft: 16, fontWeight: 600 }}>
                  {row.name}
                </td>
                <td style={{ ...tdBase, textAlign: "center" }}>
                  <span
                    className="inline-block px-2 py-0.5 rounded-lg text-sm font-bold"
                    style={{ background: "#3b82f618", color: "#60a5fa" }}
                  >
                    {row.roundCount}
                  </span>
                </td>
                {TABLE_COLS.map((c, i) => {
                  const val = row.cards[c.key];
                  const isDefault = c.color === "var(--text-default)";
                  return (
                    <td
                      key={c.key}
                      style={{
                        ...tdBase,
                        textAlign: "right",
                        fontWeight: val > 0 ? (i === 0 ? 700 : 600) : 400,
                        color:
                          val > 0
                            ? isDefault
                              ? "var(--text-default)"
                              : c.color
                            : "var(--text-dim)",
                      }}
                    >
                      {val > 0 ? val : "—"}
                    </td>
                  );
                })}
                <td style={{ ...tdBase, textAlign: "right", fontWeight: 600, color: "var(--color-blue)" }}>
                  {fmt(row.price)}
                </td>
                <td style={{ ...tdBase, textAlign: "right", fontWeight: 600 }}>
                  {fmt(row.paid)}
                </td>
                <td
                  style={{ ...tdBase, textAlign: "right", borderRight: "none" }}
                >
                  <p
                    className="font-bold text-sm"
                    style={{ color: "var(--text-default)" }}
                  >
                    {fmt(row.total)}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    сум
                  </p>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr
              style={{
                borderTop: "2px solid var(--border-default)",
                background: "var(--bg-hover)",
              }}
            >
              <td
                colSpan={3}
                style={{
                  ...tdBase,
                  paddingLeft: 16,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  fontSize: 12,
                }}
              >
                Итого
              </td>
              {TABLE_COLS.map((c) => {
                const total = rows.reduce((s, r) => s + r.cards[c.key], 0);
                const isDefault = c.color === "var(--text-default)";
                return (
                  <td
                    key={c.key}
                    style={{
                      ...tdBase,
                      textAlign: "right",
                      fontWeight: 700,
                      fontSize: 13,
                      color: isDefault ? "var(--text-default)" : c.color,
                    }}
                  >
                    {total > 0 ? total : "—"}
                  </td>
                );
              })}
              <td style={{ ...tdBase }} />
              <td
                style={{
                  ...tdBase,
                  textAlign: "right",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {fmt(totalPaid)}
              </td>
              <td
                style={{
                  ...tdBase,
                  textAlign: "right",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#22c55e",
                  borderRight: "none",
                }}
              >
                {fmt(totalRevenue)}
                <span
                  className="block text-[10px] font-normal"
                  style={{ color: "var(--text-muted)" }}
                >
                  сум
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
