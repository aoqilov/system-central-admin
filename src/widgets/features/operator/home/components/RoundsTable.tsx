import { LuGlobe, LuCreditCard, LuInbox } from "react-icons/lu";
import { fmt, type Round } from "../types";

interface Props {
  rounds: Round[];
}

const HEADS = ["Время", "Round #", "Online", "Karta", "Клиентов", "Итого"];

export function RoundsTable({ rounds }: Props) {
  const totalOnline  = rounds.reduce((s, r) => s + r.online, 0);
  const totalKarta   = rounds.reduce((s, r) => s + r.karta, 0);
  const totalPeople  = rounds.reduce((s, r) => s + r.clientCount, 0);
  const totalRevenue = rounds.reduce((s, r) => s + r.total, 0);

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
          <table className="w-full" style={{ minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                {HEADS.map((h, i) => (
                  <th
                    key={h}
                    className="text-[11px] font-semibold py-2.5"
                    style={{
                      color: "var(--text-muted)",
                      textAlign: i === 0 ? "left" : "right",
                      paddingLeft: i === 0 ? 20 : 0,
                      paddingRight: i === HEADS.length - 1 ? 20 : 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rounds.map((r, i) => (
                <tr
                  key={r.id}
                  style={
                    i < rounds.length - 1
                      ? { borderBottom: "1px solid var(--border-default)" }
                      : undefined
                  }
                >
                  <td
                    className="py-3.5 pl-5 font-mono text-sm font-semibold"
                    style={{ color: "var(--text-2)", whiteSpace: "nowrap" }}
                  >
                    {r.time}
                  </td>

                  <td className="py-3.5 pr-3 text-right">
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: "#3b82f618", color: "#60a5fa" }}
                    >
                      #{r.num}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 text-right">
                    {r.online > 0 ? (
                      <span
                        className="inline-flex items-center justify-end gap-1 text-sm font-semibold"
                        style={{ color: "#8b5cf6" }}
                      >
                        <LuGlobe size={11} />
                        {fmt(r.online)}
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: "var(--text-dim)" }}>—</span>
                    )}
                  </td>

                  <td className="py-3.5 pr-3 text-right">
                    {r.karta > 0 ? (
                      <span
                        className="inline-flex items-center justify-end gap-1 text-sm font-semibold"
                        style={{ color: "#3b82f6" }}
                      >
                        <LuCreditCard size={11} />
                        {fmt(r.karta)}
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: "var(--text-dim)" }}>—</span>
                    )}
                  </td>

                  <td
                    className="py-3.5 pr-3 text-right text-sm font-semibold"
                    style={{ color: "var(--text-default)" }}
                  >
                    {r.clientCount}
                  </td>

                  <td className="py-3.5 pr-5 text-right">
                    <p className="text-sm font-bold" style={{ color: "var(--text-default)" }}>
                      {fmt(r.total)}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>сум</p>
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
                  colSpan={2}
                  className="pl-5 py-3 text-xs font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Итого
                </td>
                <td className="pr-3 py-3 text-right text-sm font-bold" style={{ color: "#8b5cf6" }}>
                  {fmt(totalOnline)}
                </td>
                <td className="pr-3 py-3 text-right text-sm font-bold" style={{ color: "#3b82f6" }}>
                  {fmt(totalKarta)}
                </td>
                <td className="pr-3 py-3 text-right text-sm font-bold" style={{ color: "var(--text-default)" }}>
                  {totalPeople}
                </td>
                <td className="pr-5 py-3 text-right text-sm font-bold" style={{ color: "#22c55e" }}>
                  {fmt(totalRevenue)}
                  <span className="block text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>
                    сум
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
