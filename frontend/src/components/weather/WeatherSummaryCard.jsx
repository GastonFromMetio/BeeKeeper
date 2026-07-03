import { CloudSun, Clock3, MapPin, ThermometerSun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCoordinate } from '@/hooks/useRucherLocation'
import { cn } from '@/lib/utils'

function formatTemperature(value, unit = '°C') {
  if (!Number.isFinite(Number(value))) {
    return '—'
  }

  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  })

  return `${formatter.format(Number(value))} ${unit}`
}

function formatDateTime(value) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatCoordinates(latitude, longitude) {
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    return '—'
  }

  return `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`
}

export function WeatherSummaryCard({ reports, isFetching = false }) {
  const { t } = useTranslation()
  const latestReport = reports[0] ?? null
  const recentReports = reports.slice(0, 3)

  return (
    <Card className="border border-border/80 bg-card/92 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CloudSun className="size-4 text-primary" />
              {t('weather.title')}
            </CardTitle>
            <CardDescription>{t('weather.description')}</CardDescription>
          </div>
          <Badge variant="outline" className={cn(isFetching && 'border-primary/30 text-primary')}>
            {t('weather.source')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFetching && !latestReport ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Clock3 className="size-4 animate-pulse text-primary" />
              {t('weather.loading')}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('weather.loadingDescription')}
            </p>
          </div>
        ) : !latestReport ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
            <p className="text-sm font-medium">{t('weather.emptyTitle')}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('weather.emptyDescription')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-4xl font-semibold tracking-tight">
                  <ThermometerSun className="size-8 text-primary" />
                  {formatTemperature(latestReport.temperature, latestReport.temperatureUnit)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('weather.forRucher', { name: latestReport.rucherName })}
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {t('weather.apparent')}
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatTemperature(
                    latestReport.apparentTemperature,
                    latestReport.apparentTemperatureUnit,
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border bg-background/60 p-3">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {t('weather.coordinates')}
                </p>
                <p className="mt-1 font-medium">
                  <MapPin className="mr-1 inline-block size-3.5" />
                  {formatCoordinates(latestReport.latitude, latestReport.longitude)}
                </p>
              </div>
              <div className="rounded-xl border bg-background/60 p-3">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {t('weather.updatedAt')}
                </p>
                <p className="mt-1 font-medium">{formatDateTime(latestReport.fetchedAt)}</p>
                {isFetching ? (
                  <p className="mt-1 text-xs text-muted-foreground">{t('weather.refreshing')}</p>
                ) : null}
              </div>
            </div>
          </>
        )}

        {recentReports.length > 1 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {t('weather.recent')}
            </p>
            <ul className="space-y-2">
              {recentReports.map((report) => (
                <li
                  key={`${report.rucherId}-${report.fetchedAt}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{report.rucherName}</p>
                    <p className="text-xs text-muted-foreground">
                      <MapPin className="mr-1 inline-block size-3" />
                      {formatCoordinates(report.latitude, report.longitude)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatTemperature(report.temperature, report.temperatureUnit)}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(report.fetchedAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
