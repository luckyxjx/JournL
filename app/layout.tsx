import type { Metadata } from 'next'
import './globals.css'
import AppInitializer from '@/components/AppInitializer'
import ErrorBoundary from '@/components/ErrorBoundary'
import OfflineIndicator from '@/components/OfflineIndicator'
import ThemeProvider from '@/components/ThemeProvider'
import { AuthProvider } from '@/lib/auth'
import { Merriweather, Inter } from 'next/font/google'
import { PWAService } from '@/lib/pwa'

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Calm Journal',
  description: 'A private, calm journaling experience',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${inter.variable}`}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <AppInitializer>
                <PWAInitializer />
                <OfflineIndicator />
                {children}
              </AppInitializer>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

function PWAInitializer() {
  if (typeof window !== 'undefined') {
    const pwa = new PWAService();
    pwa.init();
  }
  return null;
}
