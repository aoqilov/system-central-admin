import { Navigate, useLocation } from 'react-router-dom'

export type UserRole = 'superadmin' | 'admin' | 'operator' | 'kassir'

export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function getStoredRole(): UserRole | null {
  return localStorage.getItem('user_role') as UserRole | null
}

interface AuthGuardProps {
  children: React.ReactNode
  /** Ruxsat etilgan rollar. Ko'rsatilmasa — faqat token tekshiriladi. */
  roles?: UserRole[]
}

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const location = useLocation()
  const token = getStoredToken()

  if (!token) {
    // Login dan keyin qaytib kelish uchun redirect saqlab qo'yamiz
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0) {
    const role = getStoredRole()
    if (!role || (role !== 'superadmin' && !roles.includes(role))) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}
