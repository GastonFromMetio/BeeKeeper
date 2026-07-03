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
    return <Navigate to={location.state?.from?.pathname ?? '/dashboard'} replace />
  }

  return (
    <Card className="mx-auto w-full max-w-2xl border border-border/80 bg-card/92 shadow-lg shadow-foreground/5 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-2">
        <CardTitle className="text-4xl font-bold">{t('auth.loginTitle')}</CardTitle>
        <CardDescription className="text-lg leading-8">
          {t('auth.loginDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <LoginForm />
        <p className="text-base text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/register">
            {t('auth.registerLink')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
