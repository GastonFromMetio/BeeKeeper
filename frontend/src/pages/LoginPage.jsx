import { Navigate, Link, useLocation } from 'react-router'

import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  if (!isLoading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? '/'} replace />
  }

  return (
    <Card className="mx-auto w-full max-w-xl border border-border/80 bg-white/92 shadow-sm backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl">{t('auth.loginTitle')}</CardTitle>
        <CardDescription className="text-base leading-7">
          {t('auth.loginDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
        <p className="text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/register">
            {t('auth.registerLink')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
