import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeatherSummaryCard } from '@/components/weather/WeatherSummaryCard'
import { useTranslation } from 'react-i18next'

export function RucherSummaryCards({ ruchers, ruches, weatherReports = [], isWeatherFetching = false }) {
  const { t } = useTranslation()
  const totalEmplacements = ruchers.reduce((sum, rucher) => sum + Number(rucher.nb_emplacements ?? 0), 0)
  const activeRuches = ruches.filter((ruche) => ruche.statut === 'active').length

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('navigation.ruchers')}</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{ruchers.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.activeHives')}</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{activeRuches}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('ruchers.table.capacity')}</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{totalEmplacements}</CardContent>
      </Card>
      <WeatherSummaryCard reports={weatherReports} isFetching={isWeatherFetching} />
    </div>
  )
}
