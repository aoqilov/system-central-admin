import type { AttractionRound } from "../types";

interface Props {
  rounds: AttractionRound[];
  totals: {
    people: number;
    offline: number;
    online: number;
    vip: number;
    guest: number;
    parkStaff: number;
    paid: number;
    total: number;
  };
}

function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
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
  muted:  "var(--text-muted)",
  text:   "var(--text-default)",
  border: "var(--border-default)",
  bg:     "var(--bg-second)",
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
        <table className="w-full" style={{ minWidth: 820 }}>
          <thead>
            {/* Spanning header */}
            <tr style={{ borderBottom: `1px solid ${COL.border}`, background: COL.bgCard }}>
              <th rowSpan={2} className="px-4 py-2 text-left text-xs font-medium" style={{ color: COL.muted, width: 70, borderRight: `1px solid ${COL.border}` }}>
                ВРЕМЯ
              </th>
              <th rowSpan={2} className="px-4 py-2 text-center text-xs font-medium" style={{ color: COL.muted, width: 80, borderRight: `1px solid ${COL.border}` }}>
                ROUND #
              </th>
              <th
                colSpan={6}
                className="px-4 py-2 text-center text-xs font-medium"
                style={{ color: COL.muted, borderBottom: `1px solid ${COL.border}`, borderRight: `1px solid ${COL.border}` }}
              >
                KARTA TURI
              </th>
              <th rowSpan={2} className="px-4 py-2 text-right text-xs font-medium" style={{ color: COL.muted, width: 110, borderRight: `1px solid ${COL.border}` }}>
                <span>HAQ TO'LANGAN</span>
                <br />
                <span className="font-normal" style={{ fontSize: 10 }}>(online+offline) × narx</span>
              </th>
              <th rowSpan={2} className="px-4 py-2 text-right text-xs font-medium" style={{ color: COL.muted, width: 100 }}>
                JAMI SUMMA
              </th>
            </tr>
            <tr style={{ borderBottom: `1px solid ${COL.border}`, background: COL.bgCard }}>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: COL.muted, borderRight: `1px solid ${COL.border}` }}>JAMI</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: "#06b6d4", borderRight: `1px solid ${COL.border}` }}>OFFLINE</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: "#3b82f6", borderRight: `1px solid ${COL.border}` }}>ONLINE</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: "#eab308", borderRight: `1px solid ${COL.border}` }}>VIP</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: "#8b5cf6", borderRight: `1px solid ${COL.border}` }}>MEHMON</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: "#22c55e", borderRight: `1px solid ${COL.border}` }}>PARK XODIM</th>
            </tr>
          </thead>

          <tbody>
            {rounds.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-sm" style={{ color: COL.muted }}>
                  Bugun roundlar mavjud emas
                </td>
              </tr>
            ) : (
              [...rounds].reverse().map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: `1px solid ${COL.border}` }}
                >
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
                  <td className="px-4 py-3 text-right text-sm font-medium" style={{ color: COL.text }}>
                    {dash(r.people_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#06b6d4" }}>
                    {dash(r.offline_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#3b82f6" }}>
                    {dash(r.online_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#eab308" }}>
                    {dash(r.vip_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#8b5cf6" }}>
                    {dash(r.guest_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: "#22c55e" }}>
                    {dash(r.park_staff_count)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm" style={{ color: COL.text }}>
                    {fmtDash(r.paid_amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#22c55e" }}>
                    {fmtDash(r.total_amount)}
                    <span className="ml-1 font-normal text-xs" style={{ color: COL.muted }}>сум</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Footer totals */}
          {rounds.length > 0 && (
            <tfoot>
              <tr style={{ background: COL.bgCard }}>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: COL.muted }}>
                  Итого
                </td>
                <td />
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: COL.text }}>
                  {totals.people}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#06b6d4" }}>
                  {totals.offline}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#3b82f6" }}>
                  {totals.online}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#eab308" }}>
                  {totals.vip}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#8b5cf6" }}>
                  {totals.guest}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#22c55e" }}>
                  {dash(totals.parkStaff)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: COL.text }}>
                  {fmtDash(totals.paid)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold" style={{ color: "#22c55e" }}>
                  {fmt(totals.total)}
                  <span className="ml-1 font-normal text-xs" style={{ color: COL.muted }}>сум</span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
