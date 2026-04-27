import { ArrowRight, LogOut, ShieldCheck } from 'lucide-react'
import { Link, Route, Routes } from 'react-router'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { useTranslation } from 'react-i18next'

function SessionPage() {
  const { logout, user } = useAuth()
  const { t } = useTranslation()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <section className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />
            {t('session.badge')}
          </span>
          <div className="space-y-3">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {t('session.title')}
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t('session.description')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className={buttonVariants({
                size: 'lg',
              })}
              to="/register"
            >
              {t('session.secondaryCta')}
              <ArrowRight className="size-4" />
            </Link>
            <Button variant="outline" size="lg" onClick={logout}>
              <LogOut className="size-4" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>

        <Card className="border border-border/80 bg-white/88 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('session.cardTitle')}</CardTitle>
            <CardDescription>{t('session.cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid gap-4">
              <div className="rounded-lg border border-border/70 bg-background/80 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {t('auth.name')}
                </dt>
                <dd className="mt-2 text-lg font-medium">{user?.name}</dd>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {t('auth.email')}
                </dt>
                <dd className="mt-2 text-lg font-medium">{user?.email}</dd>
              </div>
            </dl>
            <p className="text-sm leading-6 text-muted-foreground">
              {t('session.note')}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<SessionPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
