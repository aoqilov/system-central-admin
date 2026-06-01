import { useNavigate, useLocation } from 'react-router-dom'
import { LuArrowLeft, LuLayoutDashboard } from 'react-icons/lu'

export default function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--bg-main)' }}
    >
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8 inline-block">
          <span
            className="text-[120px] font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, var(--border-default) 0%, var(--border-2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </span>
        </div>

        <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
          Page not found
        </h1>
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
          The route{' '}
          <code
            className="px-1.5 py-0.5 rounded text-xs font-mono text-blue-400"
            style={{ background: 'var(--bg-second)' }}
          >
            {location.pathname}
          </code>{' '}
          does not exist.
        </p>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          It may have been moved or the URL was typed incorrectly.
        </p>

        <div className="my-8 h-px" style={{ background: 'var(--border-default)' }} />

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-3)' }}
          >
            <LuArrowLeft size={14} />
            Go back
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#3b82f6' }}
          >
            <LuLayoutDashboard size={14} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
