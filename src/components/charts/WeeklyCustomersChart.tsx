import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TooltipProps } from 'recharts'
import { weeklyCustomers } from '../../data/weeklyCustomers'

type CustomTooltipProps = TooltipProps<number, string>

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: 'var(--bg-tooltip)',
        borderColor: 'var(--border-2)',
        color: 'var(--text-4)',
      }}
    >
      <p className="mb-1">{label}</p>
      <p className="font-medium" style={{ color: 'var(--text-default)' }}>
        Customers: <span className="text-blue-400">{payload[0].value?.toLocaleString()}</span>
      </p>
    </div>
  )
}

export default function WeeklyCustomersChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={weeklyCustomers}
        barCategoryGap="35%"
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
        <Bar dataKey="customers" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
