import { useState, useEffect, useRef } from 'react'
import {
  LuArrowDownToLine,
  LuArrowUpFromLine,
  LuTriangleAlert,
  LuCircleAlert,
  LuUser,
  LuSettings2,
  LuPause,
  LuPlay,
  LuUsers,
  LuDollarSign,
  LuFerrisWheel,
  LuClock,
} from 'react-icons/lu'
import { attractions } from '../data/attractions'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'checkin' | 'checkout' | 'alert' | 'incident' | 'staff' | 'system'

interface LiveEvent {
  id: number
  type: EventType
  message: string
  time: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const eventConfig: Record<EventType, { icon: React.ElementType; color: string; bg: string }> = {
  checkin:  { icon: LuArrowDownToLine, color: '#22c55e', bg: '#22c55e18' },
  checkout: { icon: LuArrowUpFromLine, color: '#3b82f6', bg: '#3b82f618' },
  alert:    { icon: LuTriangleAlert,   color: '#eab308', bg: '#eab30818' },
  incident: { icon: LuCircleAlert,     color: '#ef4444', bg: '#ef444418' },
  staff:    { icon: LuUser,            color: '#8b5cf6', bg: '#8b5cf618' },
  system:   { icon: LuSettings2,       color: '#64748b', bg: '#64748b18' },
}

const attractionNames = attractions.map(a => a.name)

const eventTemplates: { type: EventType; messages: string[] }[] = [
  {
    type: 'checkin',
    messages: [
      `{n} guests checked in at {a}`,
      `Group of {n} entered {a}`,
      `{n} tickets scanned at {a}`,
    ],
  },
  {
    type: 'checkout',
    messages: [
      `{n} guests exited {a}`,
      `{n} visitors left {a}`,
    ],
  },
  {
    type: 'alert',
    messages: [
      `Wait time at {a} exceeded 30 min`,
      `Capacity at {a} reaching 85%`,
      `Queue buildup detected at {a}`,
    ],
  },
  {
    type: 'staff',
    messages: [
      `Staff assigned to {a}`,
      `Shift change at {a}`,
      `Operator reported to {a}`,
    ],
  },
  {
    type: 'system',
    messages: [
      `{a} ride cycle completed`,
      `Safety check passed at {a}`,
      `{a} log synced`,
    ],
  },
]

function randomEvent(id: number): LiveEvent {
  const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
  const msgTpl = template.messages[Math.floor(Math.random() * template.messages.length)]
  const attraction = attractionNames[Math.floor(Math.random() * attractionNames.length)]
  const n = Math.floor(Math.random() * 6) + 1
  const message = msgTpl.replace('{a}', attraction).replace('{n}', String(n))
  const now = new Date()
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return { id, type: template.type, message, time }
}

function generateInitialEvents(): LiveEvent[] {
  const events: LiveEvent[] = []
  for (let i = 0; i < 18; i++) events.push(randomEvent(i))
  return events.reverse()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div
      className="rounded-xl p-4 border flex items-start gap-3"
      style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${color}18` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-2xl font-semibold mt-0.5 tabular-nums" style={{ color: 'var(--text-default)' }}>
          {value}
        </p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
    </div>
  )
}

function EventRow({ event }: { event: LiveEvent }) {
  const cfg = eventConfig[event.type]
  const Icon = cfg.icon
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border-default)' }}>
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: cfg.bg }}
      >
        <Icon size={12} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>{event.message}</p>
      </div>
      <span
        className="text-[10px] font-mono shrink-0 mt-1"
        style={{ color: 'var(--text-dim)' }}
      >
        {event.time}
      </span>
    </div>
  )
}

const statusCfg = {
  open:        { dot: '#22c55e', label: 'Open' },
  maintenance: { dot: '#eab308', label: 'Maint.' },
  closed:      { dot: '#ef4444', label: 'Closed' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveMonitor() {
  const [events, setEvents] = useState<LiveEvent[]>(generateInitialEvents)
  const [paused, setPaused] = useState(false)
  const [visitors, setVisitors] = useState(2340)
  const [revenue, setRevenue] = useState(31200)
  const idRef = useRef(100)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      idRef.current += 1
      setEvents(prev => [randomEvent(idRef.current), ...prev.slice(0, 49)])
      setVisitors(v => v + Math.floor(Math.random() * 3))
      setRevenue(r => r + Math.floor(Math.random() * 5000 + 1000))
    }, 3000)
    return () => clearInterval(interval)
  }, [paused])

  const openCount = attractions.filter(a => a.status === 'open').length
  const avgWait = Math.round(
    attractions.filter(a => a.status === 'open' && (a.rulesAttraction?.roundTime ?? 0) > 0).reduce((s, a) => s + (a.rulesAttraction?.roundTime ?? 0), 0) /
    attractions.filter(a => a.status === 'open' && (a.rulesAttraction?.roundTime ?? 0) > 0).length
  )

  const topAttractions = [...attractions]
    .filter(a => a.status === 'open')
    .sort((a, b) => ((b.statsVisitors ?? []).slice(-1)[0]?.count ?? 0) - ((a.statsVisitors ?? []).slice(-1)[0]?.count ?? 0))
    .slice(0, 6)

  return (
    <div className="p-4 tablet:p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Real-time</p>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-default)' }}>
            Live Monitor
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Real-time park activity stream.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-4)' }}
          >
            <span className={`w-2 h-2 rounded-full ${paused ? 'bg-slate-400' : 'bg-green-400 animate-pulse'}`} />
            {paused ? 'Paused' : 'Live'}
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-3)' }}
          >
            {paused ? <><LuPlay size={12} /> Resume</> : <><LuPause size={12} /> Pause</>}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
        <StatCard icon={LuUsers}      label="Visitors today"  value={visitors.toLocaleString()} sub="↑ 12% vs yesterday" color="#3b82f6" />
        <StatCard icon={LuDollarSign} label="Revenue today"   value={`$${(revenue/1000).toFixed(1)}k`} sub="↑ 8% vs yesterday" color="#22c55e" />
        <StatCard icon={LuFerrisWheel}label="Attractions open" value={`${openCount} / ${attractions.length}`} sub="1 in maintenance" color="#06b6d4" />
        <StatCard icon={LuClock}      label="Avg wait time"   value={`${avgWait} min`} sub="across open rides" color="#eab308" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 desktop:grid-cols-3 gap-4">

        {/* Activity feed */}
        <div
          className="desktop:col-span-2 rounded-xl border flex flex-col"
          style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
        >
          <div className="px-5 py-3.5 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
              Activity feed
            </p>
            <div className="flex items-center gap-3">
              {Object.entries(eventConfig).slice(0, 4).map(([type, cfg]) => {
                const Icon = cfg.icon
                return (
                  <div key={type} className="hidden tablet:flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Icon size={11} style={{ color: cfg.color }} />
                    <span className="capitalize">{type}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div ref={feedRef} className="flex-1 overflow-y-auto px-5" style={{ maxHeight: 380 }}>
            {events.map(e => <EventRow key={e.id} event={e} />)}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Top attractions */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
          >
            <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
                Busiest attractions
              </p>
            </div>
            <div className="px-4 py-2">
              {topAttractions.map((a, i) => {
                const max = (topAttractions[0].statsVisitors ?? []).slice(-1)[0]?.count ?? 1
                const pct = Math.round((((a.statsVisitors ?? []).slice(-1)[0]?.count ?? 0) / max) * 100)
                return (
                  <div key={a.id} className="py-2 border-b last:border-0" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium truncate pr-2" style={{ color: 'var(--text-2)' }}>
                        <span className="mr-1.5" style={{ color: 'var(--text-dim)' }}>#{i + 1}</span>
                        {a.name}
                      </p>
                      <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {(a.statsVisitors ?? []).slice(-1)[0]?.count ?? 0}
                      </span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: 'var(--border-default)' }}>
                      <div
                        className="h-1 rounded-full bg-blue-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attraction status summary */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
          >
            <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>Status overview</p>
            </div>
            <div className="px-4 py-3 grid grid-cols-3 gap-3 text-center">
              {(['open', 'maintenance', 'closed'] as const).map(s => {
                const count = attractions.filter(a => a.status === s).length
                const cfg = statusCfg[s]
                return (
                  <div key={s}>
                    <p className="text-xl font-semibold tabular-nums" style={{ color: 'var(--text-default)' }}>
                      {count}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* All attractions grid */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
      >
        <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
            All attractions ({attractions.length})
          </p>
        </div>
        <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 wide:grid-cols-6 divide-x divide-y"
          style={{ borderColor: 'var(--border-default)' }}
        >
          {attractions.map(a => {
            const cfg = statusCfg[a.status]
            return (
              <div key={a.id} className="px-3.5 py-3" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-2)' }}>
                    {a.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {a.status === 'open' ? `${(a.statsVisitors ?? []).slice(-1)[0]?.count ?? 0} visitors` : cfg.label}
                  </span>
                  {a.status === 'open' && (a.rulesAttraction?.roundTime ?? 0) > 0 && (
                    <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-dim)' }}>
                      {a.rulesAttraction?.roundTime}m
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
