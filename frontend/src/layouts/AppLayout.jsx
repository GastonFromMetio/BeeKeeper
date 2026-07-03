import {
  Languages,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Settings,
  Warehouse,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router'

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const navigationItems = [
  { to: '/dashboard', labelKey: 'navigation.dashboard', icon: LayoutDashboard },
  { to: '/ruchers', labelKey: 'navigation.ruchers', icon: MapPinned },
  { to: '/ruches', labelKey: 'navigation.ruches', icon: Warehouse },
  { to: '/settings', labelKey: 'navigation.settings', icon: Settings },
]

function NavigationLink({ item, onClick }) {
  const { t } = useTranslation()
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
          'min-h-11 rounded-xl px-4 text-base',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        )
      }
    >
      <Icon className="size-5" />
      {t(item.labelKey)}
    </NavLink>
  )
}

function MobileNavigation() {
  const { t } = useTranslation()

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 gap-1 rounded-2xl border bg-card/95 p-1.5 shadow-xl shadow-foreground/15 backdrop-blur md:hidden">
      {navigationItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="size-5" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isFrench = i18n.language?.startsWith('fr')

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
      <Languages className="ml-1 size-4 text-muted-foreground" />
      <Button size="sm" variant={isFrench ? 'default' : 'ghost'} onClick={() => i18n.changeLanguage('fr')}>
        FR
      </Button>
      <Button size="sm" variant={!isFrench ? 'default' : 'ghost'} onClick={() => i18n.changeLanguage('en')}>
        EN
      </Button>
    </div>
  )
}

export function AppLayout() {
  const { logout, user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background/80 pb-24 text-foreground md:pb-0">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sidebar-border bg-sidebar px-5 py-6 text-sidebar-foreground shadow-xl shadow-foreground/10 md:flex md:flex-col">
        <div className="mb-10 rounded-xl border border-sidebar-border bg-sidebar-accent p-4">
          <p className="text-2xl font-bold">{t('app.name')}</p>
          <p className="mt-2 text-sm leading-6 text-sidebar-foreground/75">{t('app.subtitle')}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => (
            <NavigationLink key={item.to} item={item} />
          ))}
        </nav>

        <div className="space-y-4 border-t pt-5">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-4 text-base">
            <p className="font-semibold">{user?.name}</p>
            <p className="mt-1 truncate text-sm text-sidebar-foreground/70">{user?.email}</p>
          </div>
          <Button className="w-full justify-start" variant="outline" onClick={handleLogout}>
            <LogOut className="size-5" />
            {t('auth.logout')}
          </Button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-72">
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b bg-card/92 px-5 shadow-sm backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <details className="relative md:hidden">
              <summary
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'icon' }),
                  'list-none [&::-webkit-details-marker]:hidden',
                )}
                aria-label={t('navigation.openMenu')}
              >
                <Menu className="size-4" />
              </summary>
              <div className="absolute left-0 top-12 w-56 rounded-lg border bg-popover p-2 shadow-md">
                {navigationItems.map((item) => (
                  <NavigationLink key={item.to} item={item} />
                ))}
              </div>
            </details>
            <div>
              <p className="text-lg font-bold">{t('app.name')}</p>
              <p className="hidden text-sm text-muted-foreground sm:block">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}
