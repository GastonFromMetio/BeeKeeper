import { CloudSun, Clock3, Droplets, MapPin, ThermometerSun, Wind } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCoordinate } from '@/hooks/useRucherLocation'
import { cn } from '@/lib/utils'

function formatMetric(value, unit = '') {
  if (!Number.isFinite(Number(value))) {
    return '—'
  }

  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  })

  return `${formatter.format(Number(value))} ${unit}`.trim()
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

export function RucherWeatherCard({ report, isLoading = false, action = null }) {
  const { t } = useTranslation()

  if (isLoading && !report) {
    return (
      <Card className="border border-border/80 bg-card/92 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="size-4 text-primary" />
                {t('weather.detailsTitle')}
              </CardTitle>
              <CardDescription>{t('weather.detailsDescription')}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge variant="outline" className={cn(isLoading && 'border-primary/30 text-primary')}>
                {t('weather.source')}
              </Badge>
              {action}
            </div>
          </div>
        </CardHeader>
        <CardContent className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Clock3 className="size-4 animate-pulse text-primary" />
            {t('weather.loading')}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t('weather.loadingDescription')}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!report) {
    return (
      <Card className="border border-border/80 bg-card/92 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="size-4 text-primary" />
                {t('weather.detailsTitle')}
              </CardTitle>
              <CardDescription>{t('weather.detailsDescription')}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge variant="outline">{t('weather.source')}</Badge>
              {action}
            </div>
          </div>
        </CardHeader>
        <CardContent className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
          <p className="text-sm font-medium">{t('weather.emptyTitle')}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t('weather.emptyDescription')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border/80 bg-card/92 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CloudSun className="size-4 text-primary" />
              {t('weather.detailsTitle')}
            </CardTitle>
            <CardDescription>{t('weather.detailsDescription')}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge variant="outline">{t('weather.source')}</Badge>
            {action}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-4xl font-semibold tracking-tight">
              <ThermometerSun className="size-8 text-primary" />
              {formatMetric(report.temperature, report.temperatureUnit)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('weather.forRucher', { name: report.rucherName })}
            </p>
          </div>

          <div className="rounded-xl bg-muted/40 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {t('weather.apparent')}
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatMetric(report.apparentTemperature, report.apparentTemperatureUnit)}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-xl border bg-background/60 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {t('weather.wind')}
            </p>
            <p className="mt-1 font-medium">
              <Wind className="mr-1 inline-block size-3.5" />
              {formatMetric(report.windSpeed, report.windSpeedUnit)}
            </p>
          </div>
          <div className="rounded-xl border bg-background/60 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {t('weather.humidity')}
            </p>
            <p className="mt-1 font-medium">
              <Droplets className="mr-1 inline-block size-3.5" />
              {formatMetric(report.humidity, report.humidityUnit)}
            </p>
          </div>
          <div className="rounded-xl border bg-background/60 p-3 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {t('weather.coordinates')}
            </p>
            <p className="mt-1 font-medium">
              <MapPin className="mr-1 inline-block size-3.5" />
              {formatCoordinates(report.latitude, report.longitude)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('weather.updatedAt')}: {formatDateTime(report.fetchedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
