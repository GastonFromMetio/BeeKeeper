import { Toaster } from 'sonner'

import { AuthProvider } from '@/contexts/AuthContext'
import { WeatherProvider } from '@/contexts/WeatherContext'
import { AppRouter } from '@/router/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: '12px',
            },
          }}
        />
      </WeatherProvider>
    </AuthProvider>
  )
}
