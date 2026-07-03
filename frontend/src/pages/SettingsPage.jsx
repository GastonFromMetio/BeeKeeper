import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { logout, user } = useAuth()
  const { i18n, t } = useTranslation()

  return (
    <div className="max-w-4xl space-y-8">
      <div className="rounded-xl border bg-secondary p-6 text-secondary-foreground shadow-md shadow-foreground/8">
        <h1 className="text-4xl font-bold">{t('settings.title')}</h1>
        <p className="mt-2 text-lg opacity-80">{t('settings.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.account')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">{t('auth.name')}:</span> {user?.name}</p>
          <p><span className="font-medium">{t('auth.email')}:</span> {user?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language')}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant={i18n.language.startsWith('fr') ? 'default' : 'outline'} onClick={() => i18n.changeLanguage('fr')}>
            FR
          </Button>
          <Button variant={i18n.language.startsWith('en') ? 'default' : 'outline'} onClick={() => i18n.changeLanguage('en')}>
            EN
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.theme')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle showLabels />
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={logout}>
        {t('auth.logout')}
      </Button>
    </div>
  )
}
