import { Navigate, Link } from 'react-router'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Card className="mx-auto w-full max-w-2xl border border-border/80 bg-card/92 shadow-lg shadow-foreground/5 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-2">
        <CardTitle className="text-4xl font-bold">{t('auth.registerTitle')}</CardTitle>
        <CardDescription className="text-lg leading-8">
          {t('auth.registerDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <RegisterForm />
        <p className="text-base text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/login">
            {t('auth.loginLink')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
