import { Compass } from 'lucide-react'
import { Link } from 'react-router'

import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function NotFoundPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full rounded-2xl border border-border/70 bg-white/92 p-8 text-center shadow-sm backdrop-blur-sm sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Compass className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t('notFound.title')}</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {t('notFound.description')}
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            className={buttonVariants({
              size: 'lg',
            })}
            to={isAuthenticated ? '/dashboard' : '/login'}
          >
            {isAuthenticated ? t('notFound.backHome') : t('notFound.backLogin')}
          </Link>
        </div>
      </section>
    </main>
  )
}
