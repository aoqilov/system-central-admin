import { useState } from 'react'
import StatCard from '../components/ui/StatCard'
import FilterBar from '../components/ui/FilterBar'
import type { Filters } from '../components/ui/FilterBar'
import ExportButton from '../components/ui/ExportButton'
import WeeklyCustomersChart from '../components/charts/WeeklyCustomersChart'
import RevenueTrendChart from '../components/charts/RevenueTrendChart'
import { dailyBreakdown } from '../data/dailyBreakdown'
import { statsCards } from '../data/statsCards'

const dateLabel: Record<string, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '90d': 'last 3 months',
}

export default function Reports() {
  const [filters, setFilters] = useState<Filters>({
    dateRange: '7d',
    employee: 'all',
    attraction: 'all',
  })

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            Analytics
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-default)' }}>
            Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Trends, comparisons, and exports for the period.
          </p>
        </div>
        <ExportButton />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar filters={filters} onChange={setFilters} />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Showing {dateLabel[filters.dateRange]}
        </p>
      </div>

      {/* Stats — 1 col mobile, 3 col tablet+ */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
        {statsCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts — 1 col mobile+tablet, 2 col desktop+ */}
      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-5 border"
          style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-2)' }}>
            Weekly customers
          </p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            Visitors per day
          </p>
          <WeeklyCustomersChart />
        </div>

        <div
          className="rounded-xl p-5 border"
          style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-2)' }}>
            Revenue trend
          </p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            Revenue per day
          </p>
          <RevenueTrendChart />
        </div>
      </div>

      {/* Table — horizontal scroll on mobile & tablet */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            Daily breakdown
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                {['Day', 'Customers', 'Sessions', 'Revenue', 'Avg / customer'].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dailyBreakdown.map((row, i) => (
                <tr
                  key={row.day}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  style={{
                    borderBottom:
                      i < dailyBreakdown.length - 1 ? '1px solid var(--border-default)' : 'none',
                  }}
                >
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-3)' }}>
                    {row.day}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-2)' }}>
                    {row.customers.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-2)' }}>
                    {row.sessions.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-green-500 font-medium">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-4)' }}>
                    ${row.avg.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
