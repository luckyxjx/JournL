'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isGuest: boolean
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signInAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const initializeAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        if (mounted) setLoading(false)
        return
      }

      try {
        // Check for guest mode with timestamp validation
        const guestData = localStorage.getItem('guestMode')
        if (guestData) {
          try {
            const { enabled, timestamp } = JSON.parse(guestData)
            const isValid = enabled && (Date.now() - timestamp < 24 * 60 * 60 * 1000) // 24h expiry
            if (isValid) {
              if (mounted) {
                setIsGuest(true)
                setLoading(false)
              }
              return
            } else {
              localStorage.removeItem('guestMode')
            }
          } catch (e) {
            localStorage.removeItem('guestMode')
          }
        }

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'no user')
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        // Clear guest mode if user signs in
        if (session?.user) {
          localStorage.removeItem('guestMode')
          setIsGuest(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInAsGuest = () => {
    try {
      const guestData = { enabled: true, timestamp: Date.now() }
      localStorage.setItem('guestMode', JSON.stringify(guestData))
      setIsGuest(true)
      setLoading(false)
    } catch (error) {
      console.error('Failed to set guest mode:', error)
    }
  }

  const signOut = async () => {
    localStorage.removeItem('guestMode')
    setIsGuest(false)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    isGuest,
    signInWithGoogle,
    signInWithApple,
    signInWithMagicLink,
    signInAsGuest,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}