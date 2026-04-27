import { Navigate, Link } from 'react-router'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Card className="mx-auto w-full max-w-xl border border-border/80 bg-white/92 shadow-sm backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl">{t('auth.registerTitle')}</CardTitle>
        <CardDescription className="text-base leading-7">
          {t('auth.registerDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RegisterForm />
        <p className="text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/login">
            {t('auth.loginLink')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
