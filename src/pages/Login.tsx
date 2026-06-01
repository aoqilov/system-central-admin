import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LuLock, LuMail, LuEye, LuEyeOff } from 'react-icons/lu'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPw, setShowPw] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      if (email === 'admin' && password === 'admin') {
        navigate(redirect)
      } else {
        setError('Invalid email or password.')
        setLoading(false)
      }
    }, 900)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-main)' }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-default)' }}>
            ParkOps
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Control Center
          </p>
        </div>

        <div
          className="rounded-2xl p-6 border"
          style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
        >
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text-default)' }}>
            Sign in
          </h2>
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--text-4)' }}
              >
                Email
              </label>
              <div className="relative">
                <LuMail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@park.io"
                  autoComplete="email"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none border transition-colors focus:border-blue-500/60"
                  style={{
                    background: 'var(--bg-input)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-2)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--text-4)' }}
              >
                Password
              </label>
              <div className="relative">
                <LuLock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none border transition-colors focus:border-blue-500/60"
                  style={{
                    background: 'var(--bg-input)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-2)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-slate-300"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPw ? <LuEyeOff size={14} /> : <LuEye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 px-1">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
              style={{ background: '#3b82f6' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: 'var(--text-dim)' }}>
            Demo: <span style={{ color: 'var(--text-muted)' }}>admin</span> /{' '}
            <span style={{ color: 'var(--text-muted)' }}>admin</span>
          </p>
        </div>
      </div>
    </div>
  )
}
