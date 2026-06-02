import { useNavigate } from 'react-router-dom'
import { LuShieldOff } from 'react-icons/lu'
import { CusButton } from '../components/ui/buttons/CusButton'

export default function Unauthorized() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    navigate('/login', { replace: true })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-main)' }}
    >
      <div className="flex flex-col items-center text-center max-w-xs">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'var(--bg-second)' }}
        >
          <LuShieldOff size={28} className="text-red-400" />
        </div>

        <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-default)' }}>
          Kirish taqiqlangan
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Bu sahifaga kirishga ruxsatingiz yo'q. Boshqa akkount bilan kiring.
        </p>

        <CusButton
          colorPalette="blue"
          variant="subtle"
          onClick={handleLogout}
        >
          Boshqa akkount bilan kirish
        </CusButton>
      </div>
    </div>
  )
}
