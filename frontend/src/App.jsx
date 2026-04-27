import { Toaster } from 'sonner'

import { AuthProvider } from '@/contexts/AuthContext'
import { AppRouter } from '@/router/AppRouter'

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}
