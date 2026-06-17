import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { revenueTrend } from '../../data/revenueTrend'

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

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
        Revenue: <span className="text-cyan-400">${payload[0].value?.toLocaleString()}</span>
      </p>
    </div>
  )
}

export default function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-2)' }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#06b6d4"
          strokeWidth={2.5}
          fill="url(#areaGrad)"
          dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#06b6d4', stroke: 'var(--bg-main)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
