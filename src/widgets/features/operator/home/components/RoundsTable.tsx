import type { AttractionRound } from "../types";

interface Props {
  rounds: AttractionRound[];
  totals: {
    offline: number;
    online: number;
    vip: number;
    guest: number;
    people: number;
    total: number;
  };
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function dash(n: number) {
  return n === 0 ? "—" : String(n);
}

function fmtDash(n: number) {
  return n === 0 ? "—" : fmt(n);
}

function time(iso: string) {
  return iso?.slice(11, 16) ?? "—";
}

const COL = {
  muted: "var(--text-muted)",
  text: "var(--text-default)",
  border: "var(--border-default)",
  bg: "var(--bg-second)",
  bgCard: "var(--bg-main)",
};

export function RoundsTable({ rounds, totals }: Props) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: COL.bg, borderColor: COL.border }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: COL.border }}>
        <p className="font-semibold text-sm" style={{ color: COL.text }}>
          Сегодняшние раунды
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COL.border}`, background: COL.bgCard }}>
              <th
                rowSpan={2}
                className="px-4 py-2 text-left text-xs font-medium"
                style={{ color: COL.muted, width: 70, borderRight: `1px solid ${COL.border}` }}
              >
                ВРЕМЯ
              </th>
              <th
                rowSpan={2}
                className="px-4 py-2 text-center text-xs font-medium"
                style={{ color: COL.muted, width: 80, borderRight: `1px solid ${COL.border}` }}
              >
                ROUND #
              </th>
              <th
                colSpan={4}
                className="px-4 py-2 text-center text-xs font-medium"
                style={{
                  color: COL.muted,
                  borderBottom: `1px solid ${COL.border}`,
                  borderRight: `1px solid ${COL.border}`,
                }}
              >
                ТИП КАРТЫ
              </th>
              <th
                rowSpan={2}
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: COL.muted, width: 80, borderRight: `1px solid ${COL.border}` }}
              >
                ВСЕГО
              </th>
              <th
                rowSpan={2}
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: COL.muted, width: 100, borderRight: `1px solid ${COL.border}` }}
              >
                1X NARX
              </th>
              <th
                rowSpan={2}
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: "#22c55e", width: 110 }}
              >
                ИТОГО
              </th>
            </tr>
            <tr style={{ borderBottom: `1px solid ${COL.border}`, background: COL.bgCard }}>
              <th
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: "#06b6d4", borderRight: `1px solid ${COL.border}` }}
              >
                CLASSIC
              </th>
              <th
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: "#3b82f6", borderRight: `1px solid ${COL.border}` }}
              >
                ONLINE
              </th>
              <th
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: "#8b5cf6", borderRight: `1px solid ${COL.border}` }}
              >
                VIP
              </th>
              <th
                className="px-4 py-2 text-right text-xs font-medium"
                style={{ color: "#eab308", borderRight: `1px solid ${COL.border}` }}
              >
                ORG
              </th>
            </tr>
          </thead>

          <tbody>
            {rounds.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: COL.muted }}
                >
                  Сегодня раундов нет
                </td>
              </tr>
            ) : (
              [...rounds].reverse().map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${COL.border}` }}>
                  <td className="px-4 py-3 text-sm" style={{ color: COL.muted }}>
                    {time(r.started_at)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-flex items-center justify-center text-xs font-bold rounded-lg px-2 py-1"
                      style={{ background: "#3b82f620", color: "#3b82f6", minWidth: 36 }}
                    >
                      #{r.round_number}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#06b6d4" }}>
                    {dash(r.offline_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#3b82f6" }}>
                    {dash(r.online_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#8b5cf6" }}>
                    {dash(r.vip_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#eab308" }}>
                    {dash(r.organization_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium" style={{ color: COL.text }}>
                    {dash(r.people_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: COL.muted }}>
                    {fmtDash(r.paid_amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#22c55e" }}>
                    {fmtDash(r.total_amount)}
                    {r.total_amount > 0 && (
                      <span className="ml-1 font-normal text-xs" style={{ color: COL.muted }}>
                        сум
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {rounds.length > 0 && (
            <tfoot>
              <tr style={{ background: COL.bgCard, borderTop: `2px solid ${COL.border}` }}>
                <td colSpan={2} className="px-4 py-3 text-sm font-semibold" style={{ color: COL.muted }}>
                  Итого
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#06b6d4" }}>
                  {totals.offline}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#3b82f6" }}>
                  {totals.online}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#8b5cf6" }}>
                  {totals.vip}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#eab308" }}>
                  {totals.guest}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: COL.text }}>
                  {totals.people}
                </td>
                <td className="px-4 py-3 text-right text-sm" style={{ color: COL.muted }}>
                  —
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold" style={{ color: "#22c55e" }}>
                  {fmt(totals.total)}
                  <span className="ml-1 font-normal text-xs" style={{ color: COL.muted }}>
                    сум
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
