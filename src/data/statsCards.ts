export type Trend = 'up' | 'down' | 'neutral'

export interface StatCard {
  label: string
  value: string
  change: string
  trend: Trend
  isRevenue?: boolean
}

export const statsCards: StatCard[] = [
  {
    label: 'Customers',
    value: '7 990',
    change: '+18%',
    trend: 'up',
  },
  {
    label: 'Revenue',
    value: '$145 700',
    change: '+12%',
    trend: 'up',
    isRevenue: true,
  },
  {
    label: 'Sessions',
    value: '5 862',
    change: '-2%',
    trend: 'down',
  },
]
