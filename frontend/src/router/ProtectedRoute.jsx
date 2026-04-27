import { Navigate, Outlet, useLocation } from 'react-router'

import { LoadingState } from '@/components/feedback/LoadingState'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState label={t('auth.restoringSession')} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
