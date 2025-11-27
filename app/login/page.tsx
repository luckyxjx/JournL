'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithApple, signInWithMagicLink, signInAsGuest, isGuest, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Add delay to prevent navigation race conditions
    const timer = setTimeout(() => {
      if (!authLoading && (user || isGuest)) {
        router.replace('/')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, isGuest, authLoading, router])

  if (authLoading || (!authLoading && (user || isGuest))) {
    return (
      <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-peaceful-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="text-peaceful-text text-lg">
            {authLoading ? 'Loading...' : 'Redirecting...'}
          </div>
        </div>
      </div>
    )
  }

  const handleGoogleSignIn = async () => {
    setLoading('google')
    setError('')
    setSuccess('')
    try {
      await signInWithGoogle()
      // OAuth will redirect, so no need to manually navigate
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError(err?.message || 'Failed to sign in with Google. Please try again.')
    } finally {
      setLoading('')
    }
  }

  const handleAppleSignIn = async () => {
    setLoading('apple')
    setError('')
    setSuccess('')
    try {
      await signInWithApple()
      // OAuth will redirect, so no need to manually navigate
    } catch (err: any) {
      console.error('Apple sign in error:', err)
      setError(err?.message || 'Failed to sign in with Apple. Please try again.')
    } finally {
      setLoading('')
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading('email')
    setError('')
    setSuccess('')
    try {
      await signInWithMagicLink(email)
      setSuccess('Check your email for the magic link!')
      setEmail('')
    } catch (err: any) {
      console.error('Magic link error:', err)
      setError(err?.message || 'Failed to send magic link. Please try again.')
    } finally {
      setLoading('')
    }
  }

  const handleGuestMode = () => {
    setLoading('guest')
    setError('')
    setSuccess('')
    try {
      signInAsGuest()
    } catch (err: any) {
      console.error('Guest mode error:', err)
      setError('Failed to enter guest mode. Please try again.')
      setLoading('')
    }
  }

  return (
    <div className="min-h-screen bg-peaceful-bg flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl border border-peaceful-accent/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">
            Welcome to CalmJournal
          </h1>
          <p className="text-peaceful-text/80 text-sm">
            Your private space for reflection and growth
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100/80 border border-red-300/50 text-red-800 rounded-xl text-sm animate-fade-in">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-peaceful-button/20 border border-peaceful-accent text-peaceful-text rounded-xl text-sm animate-fade-in">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={!!loading}
            className="w-full bg-white border-2 border-peaceful-accent/40 text-peaceful-text py-3.5 px-4 rounded-xl hover:bg-peaceful-card hover:border-peaceful-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium transition-all duration-200 shadow-sm hover:shadow"
          >
            {loading === 'google' ? (
              <>
                <Spinner />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Apple Sign In */}
          <button
            onClick={handleAppleSignIn}
            disabled={!!loading}
            className="w-full bg-peaceful-text text-white py-3.5 px-4 rounded-xl hover:bg-peaceful-text/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium transition-all duration-200 shadow-sm hover:shadow"
          >
            {loading === 'apple' ? (
              <>
                <Spinner />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <AppleIcon />
                <span>Continue with Apple</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-peaceful-accent/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-peaceful-text font-medium">or</span>
            </div>
          </div>

          {/* Email Magic Link */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 pl-11 border-2 border-peaceful-accent/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-peaceful-accent focus:border-peaceful-accent transition-all duration-200 bg-white text-peaceful-text placeholder-peaceful-text/60"
                required
                disabled={!!loading}
              />
              <EmailIcon />
            </div>
            <button
              type="submit"
              disabled={!!loading}
              className="w-full bg-peaceful-button text-white py-3.5 px-4 rounded-xl hover:bg-peaceful-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              {loading === 'email' ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  Sending...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-peaceful-accent/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-peaceful-text font-medium">or</span>
            </div>
          </div>

          {/* Guest Mode */}
          <button
            onClick={handleGuestMode}
            disabled={!!loading}
            className="w-full bg-peaceful-accent text-white py-3.5 px-4 rounded-xl hover:bg-peaceful-button disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            {loading === 'guest' ? (
              <>
                <Spinner />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <UserIcon />
                <span>Continue as Guest</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 p-4 bg-peaceful-card/60 rounded-xl border border-peaceful-accent/20">
          <p className="text-xs text-peaceful-text/90 text-center leading-relaxed">
            <strong>Guest mode</strong> keeps all your data local only. 
            <br />
            Sign in to sync preferences and streaks across devices.
          </p>
        </div>
      </div>
    </div>
  )
}

// Icon Components
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-peaceful-text/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}