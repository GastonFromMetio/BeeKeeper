import { ThemeProvider } from 'next-themes'

import { AuthProvider } from '@/contexts/AuthContext'
import { WeatherProvider } from '@/contexts/WeatherContext'
import { AppRouter } from '@/router/AppRouter'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <WeatherProvider>
          <AppRouter />
          <Toaster position="top-right" richColors />
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
