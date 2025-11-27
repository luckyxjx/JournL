import { useAuth } from './AuthContext'

export { useAuth }

export function useUser() {
  const { user, isGuest } = useAuth()
  return { user, isGuest, isAuthenticated: !!user || isGuest }
}

export function useSession() {
  const { session } = useAuth()
  return session
}