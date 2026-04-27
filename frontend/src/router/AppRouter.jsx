import { Navigate, Route, Routes } from 'react-router'

import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RucherDetailPage } from '@/pages/RucherDetailPage'
import { RuchersPage } from '@/pages/RuchersPage'
import { RuchesPage } from '@/pages/RuchesPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ruchers" element={<RuchersPage />} />
          <Route path="/ruchers/:rucherId" element={<RucherDetailPage />} />
          <Route path="/ruches" element={<RuchesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
