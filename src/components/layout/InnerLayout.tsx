import { useState } from 'react'
import type { IconType } from 'react-icons'

export interface InnerSection {
  id: string
  label: string
  icon: IconType
  badge?: string | number
  content: React.ReactNode
}

interface InnerLayoutProps {
  sections: InnerSection[]
  defaultSection?: string
}

export function InnerLayout({ sections, defaultSection }: InnerLayoutProps) {
  const [active, setActive] = useState(defaultSection ?? sections[0]?.id)
  const current = sections.find(s => s.id === active)

  return (
    <div className="flex flex-col desktop:flex-row" style={{ minHeight: 'calc(100vh - 128px)' }}>
      {/* Mobile + tablet: horizontal scrollable tab bar */}
      <div
        className="desktop:hidden flex overflow-x-auto border-b gap-1 px-3 py-2 shrink-0"
        style={{ borderColor: 'var(--border-default)' }}
      >
        {sections.map(s => {
          const isActive = s.id === active
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-all"
              style={{
                background: isActive ? '#3b82f620' : 'transparent',
                color: isActive ? '#60a5fa' : 'var(--text-4)',
                border: isActive ? '1px solid #3b82f630' : '1px solid transparent',
              }}
            >
              <s.icon size={14} style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)' }} />
              {s.label}
              {s.badge !== undefined && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: isActive ? '#3b82f630' : 'var(--bg-second)',
                    color: isActive ? '#60a5fa' : 'var(--text-muted)',
                  }}
                >
                  {s.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Desktop: vertical sidebar */}
      <aside
        className="hidden desktop:block w-44 shrink-0 border-r overflow-y-auto"
        style={{
          borderColor: 'var(--border-default)',
          position: 'sticky',
          top: 0,
          height: 'calc(100vh - 128px)',
        }}
      >
        <nav className="p-2 space-y-0.5 pt-3">
          {sections.map(s => {
            const isActive = s.id === active
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-all group"
                style={{
                  background: isActive ? '#3b82f620' : 'transparent',
                  color: isActive ? '#60a5fa' : 'var(--text-4)',
                  border: isActive ? '1px solid #3b82f630' : '1px solid transparent',
                }}
              >
                <s.icon
                  size={15}
                  style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)', flexShrink: 0 }}
                />
                <span className="truncate">{s.label}</span>
                {s.badge !== undefined && (
                  <span
                    className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                    style={{
                      background: isActive ? '#3b82f630' : 'var(--bg-second)',
                      color: isActive ? '#60a5fa' : 'var(--text-muted)',
                    }}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">{current?.content}</div>
    </div>
  )
}
