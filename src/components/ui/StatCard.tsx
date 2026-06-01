import { LuTrendingUp, LuTrendingDown, LuMinus } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import type { Trend } from '../../data/statsCards'

interface TrendConfig {
  icon: IconType
  bg: string
  text: string
  dot: string
}

const trendConfig: Record<Trend, TrendConfig> = {
  up: { icon: LuTrendingUp, bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  down: {
    icon: LuTrendingDown,
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  neutral: { icon: LuMinus, bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
}

interface StatCardProps {
  label: string
  value: string
  change: string
  trend?: Trend
  delay?: number
}

export default function StatCard({ label, value, change, trend = 'neutral' }: StatCardProps) {
  const cfg = trendConfig[trend]
  const Icon = cfg.icon

  return (
    <div
      className="flex-1 rounded-xl p-6 border"
      style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
    >
      <p className="text-sm mb-3" style={{ color: 'var(--text-4)' }}>
        {label}
      </p>
      <p
        className="text-3xl font-semibold tracking-tight mb-4"
        style={{ color: 'var(--text-default)' }}
      >
        {value}
      </p>
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <Icon size={11} />
        {change} vs last week
      </div>
    </div>
  )
}
