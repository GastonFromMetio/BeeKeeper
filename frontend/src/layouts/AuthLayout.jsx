import { Languages } from 'lucide-react'
import { Outlet } from 'react-router'

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export function AuthLayout() {
  const { i18n, t } = useTranslation()

  return (
    <main className="relative min-h-screen overflow-hidden bg-background/80">
      <div className="absolute inset-x-0 top-0 h-40 border-b border-border/60 bg-gradient-to-b from-primary/12 via-primary/5 to-transparent" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4 rounded-2xl border bg-card/70 px-4 py-3 shadow-sm backdrop-blur-md">
          <div>
            <p className="text-base font-bold uppercase tracking-[0.12em] text-primary">
              BeeKeeper
            </p>
            <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
              {t('auth.layoutHint')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="rounded-full bg-card/85 shadow-sm backdrop-blur-sm" />
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card/85 p-1 shadow-sm backdrop-blur-sm">
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
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(30rem,0.75fr)] lg:py-12">
          <div className="hidden lg:block">
            <div className="max-w-2xl space-y-7">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-base font-semibold text-primary">
                {t('auth.kicker')}
              </span>
              <div className="space-y-5">
                <h1 className="text-5xl font-bold leading-[1.05] text-balance text-foreground xl:text-6xl">
                  {t('auth.heroTitle')}
                </h1>
                <p className="max-w-xl text-xl leading-9 text-muted-foreground">
                  {t('auth.heroDescription')}
                </p>
              </div>
              <div className="grid max-w-xl grid-cols-3 gap-3">
                <div className="rounded-2xl border bg-card/70 p-4 shadow-sm">
                  <p className="text-2xl font-bold">4</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('auth.demoApiaries')}</p>
                </div>
                <div className="rounded-2xl border bg-card/70 p-4 shadow-sm">
                  <p className="text-2xl font-bold">12</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('auth.demoHives')}</p>
                </div>
                <div className="rounded-2xl border bg-card/70 p-4 shadow-sm">
                  <p className="text-2xl font-bold">2</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('auth.demoLanguages')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full justify-self-end">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
