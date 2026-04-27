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
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )
      }
    >
      <Icon className="size-4" />
      {t(item.labelKey)}
    </NavLink>
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
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-muted/20 px-4 py-5 md:flex md:flex-col">
        <div className="mb-8">
          <p className="text-lg font-semibold">{t('app.name')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('app.subtitle')}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => (
            <NavigationLink key={item.to} item={item} />
          ))}
        </nav>

        <div className="space-y-3 border-t pt-4">
          <div className="rounded-lg bg-background p-3 text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button className="w-full justify-start" variant="outline" onClick={handleLogout}>
            <LogOut className="size-4" />
            {t('auth.logout')}
          </Button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8">
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
              <p className="font-medium">{t('app.name')}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{t('app.subtitle')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
