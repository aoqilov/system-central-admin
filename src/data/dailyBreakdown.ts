export interface DailyBreakdownItem {
  day: string
  customers: number
  sessions: number
  revenue: number
  avg: number
}

export const dailyBreakdown: DailyBreakdownItem[] = [
  { day: 'Monday', customers: 820, sessions: 740, revenue: 15800, avg: 19.27 },
  { day: 'Tuesday', customers: 940, sessions: 860, revenue: 15200, avg: 16.17 },
  { day: 'Wednesday', customers: 870, sessions: 790, revenue: 15600, avg: 17.93 },
  { day: 'Thursday', customers: 1050, sessions: 980, revenue: 17400, avg: 16.57 },
  { day: 'Friday', customers: 1240, sessions: 1120, revenue: 19800, avg: 15.97 },
  { day: 'Saturday', customers: 1580, sessions: 1420, revenue: 31200, avg: 19.75 },
  { day: 'Sunday', customers: 1490, sessions: 1352, revenue: 30700, avg: 20.67 },
]
