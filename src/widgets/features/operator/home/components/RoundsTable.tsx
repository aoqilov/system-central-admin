import { LuInbox, LuUsers, LuWifi, LuWifiOff, LuStar, LuUserCheck, LuShield } from "react-icons/lu";
import { fmt, type CardCounts, type Round } from "../types";

interface Props {
  rounds: Round[];
}

const CARD_COLS: { key: keyof CardCounts; label: string; color: string; icon: React.ElementType }[] = [
  { key: "jami",      label: "Jami",       color: "var(--text-default)", icon: LuUsers      },
  { key: "asosiy",    label: "Offline",    color: "#3b82f6",             icon: LuWifiOff    },
  { key: "online",    label: "Online",     color: "#8b5cf6",             icon: LuWifi       },
  { key: "vip",       label: "VIP",        color: "#eab308",             icon: LuStar       },
  { key: "mehmon",    label: "Mehmon",     color: "#06b6d4",             icon: LuUserCheck  },
  { key: "parkXodim", label: "Park xodim", color: "#22c55e",             icon: LuShield     },
];

const thBase: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: 11,
  fontWeight: 600,
  padding: "6px 10px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid var(--border-default)",
  borderRight: "1px solid var(--border-default)",
  background: "var(--bg-hover)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdBase: React.CSSProperties = {
  fontSize: 13,
  padding: "10px 10px",
  borderBottom: "1px solid var(--border-default)",
  whiteSpace: "nowrap",
  color: "var(--text-default)",
};

export function RoundsTable({ rounds }: Props) {
  const totalRevenue = rounds.reduce((s, r) => s + r.total, 0);
  const cardTotals = CARD_COLS.map((c) => ({
    key: c.key,
    total: rounds.reduce((s, r) => s + r.cards[c.key], 0),
  }));

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <div
        className="px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          Сегодняшние раунды
        </p>
      </div>

      {rounds.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--bg-hover)" }}
          >
            <LuInbox size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Раундов пока нет
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 720 }}>
            <thead>
              {/* Row 1 */}
              <tr>
                <th rowSpan={2} style={{ ...thBase, textAlign: "left", paddingLeft: 16 }}>
                  Время
                </th>
                <th rowSpan={2} style={{ ...thBase, textAlign: "center" }}>
                  Round #
                </th>
                <th
                  colSpan={CARD_COLS.length}
                  style={{ ...thBase, textAlign: "center", paddingBottom: 16 }}
                >
                  Karta turi
                </th>
                <th rowSpan={2} style={{ ...thBase, textAlign: "right", lineHeight: 1.4 }}>
                  <span style={{ display: "block" }}>Haq to'langan</span>
                  <span style={{ display: "block", fontWeight: 400, fontSize: 10, color: "var(--text-dim)", textTransform: "none", letterSpacing: 0 }}>
                    (online+offline) × narx
                  </span>
                </th>
                <th rowSpan={2} style={{ ...thBase, textAlign: "right", paddingRight: 16, borderRight: "none" }}>
                  Jami summa
                </th>
              </tr>

              {/* Row 2 — card sub-columns */}
              <tr>
                {CARD_COLS.map((c) => (
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
              {rounds.map((r, ri) => (
                <tr
                  key={r.id}
                  style={ri < rounds.length - 1 ? { borderBottom: "1px solid var(--border-default)" } : undefined}
                >
                  {/* Время */}
                  <td style={{ ...tdBase, paddingLeft: 16, fontFamily: "monospace", fontWeight: 600, color: "var(--text-2)", borderRight: "1px solid var(--border-default)" }}>
                    {r.time}
                  </td>

                  {/* Round # */}
                  <td style={{ ...tdBase, textAlign: "center", borderRight: "1px solid var(--border-default)" }}>
                    <span
                      className="inline-block px-2 py-0.5 rounded-lg text-sm font-bold"
                      style={{ background: "#3b82f618", color: "#60a5fa" }}
                    >
                      #{r.num}
                    </span>
                  </td>

                  {/* Card type sub-columns */}
                  {CARD_COLS.map((c, i) => {
                    const val = r.cards[c.key];
                    return (
                      <td
                        key={c.key}
                        style={{
                          ...tdBase,
                          textAlign: "right",
                          fontWeight: val > 0 ? 600 : 400,
                          color: val > 0 ? c.color : "var(--text-dim)",
                          borderRight: "1px solid var(--border-default)",
                          ...(i === 0 ? { fontWeight: 700 } : {}),
                        }}
                      >
                        {val > 0 ? val : "—"}
                      </td>
                    );
                  })}

                  {/* Narx 1x */}
                  <td style={{ ...tdBase, textAlign: "right", color: "var(--text-default)", fontWeight: 600, borderRight: "1px solid var(--border-default)" }}>
                    {fmt((r.cards.online + r.cards.asosiy) * r.price)}
                  </td>

                  {/* Jami summa */}
                  <td style={{ ...tdBase, textAlign: "right", paddingRight: 16 }}>
                    <p className="font-bold text-sm" style={{ color: "var(--text-default)" }}>
                      {fmt(r.total)}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>сум</p>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr style={{ borderTop: "2px solid var(--border-default)", background: "var(--bg-hover)" }}>
                <td
                  colSpan={2}
                  style={{ ...tdBase, paddingLeft: 16, fontWeight: 700, color: "var(--text-muted)", fontSize: 12, borderRight: "1px solid var(--border-default)" }}
                >
                  Итого
                </td>
                {cardTotals.map((ct, i) => (
                  <td
                    key={ct.key}
                    style={{
                      ...tdBase,
                      textAlign: "right",
                      fontWeight: 700,
                      fontSize: 13,
                      color: CARD_COLS[i].color,
                      borderRight: "1px solid var(--border-default)",
                    }}
                  >
                    {ct.total > 0 ? ct.total : "—"}
                  </td>
                ))}
                <td style={{ ...tdBase, borderRight: "1px solid var(--border-default)" }} />
                <td style={{ ...tdBase, textAlign: "right", paddingRight: 16, fontWeight: 700, fontSize: 13, color: "#22c55e" }}>
                  {fmt(totalRevenue)}
                  <span className="block text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>сум</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
