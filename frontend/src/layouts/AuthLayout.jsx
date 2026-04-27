import { Languages } from 'lucide-react'
import { Outlet } from 'react-router'

import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export function AuthLayout() {
  const { i18n, t } = useTranslation()

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-52 border-b border-border/60 bg-gradient-to-b from-primary/14 via-primary/6 to-transparent" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
              BeeKeeper
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('auth.layoutHint')}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-white/85 p-1 shadow-sm backdrop-blur-sm">
            <Languages className="ml-2 size-4 text-muted-foreground" />
            <Button
              size="sm"
              variant={i18n.language.startsWith('fr') ? 'default' : 'ghost'}
              onClick={() => i18n.changeLanguage('fr')}
            >
              FR
            </Button>
            <Button
              size="sm"
              variant={i18n.language.startsWith('en') ? 'default' : 'ghost'}
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {t('auth.kicker')}
              </span>
              <div className="space-y-4">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-foreground">
                  {t('auth.heroTitle')}
                </h1>
                <p className="max-w-lg text-lg leading-8 text-muted-foreground">
                  {t('auth.heroDescription')}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
