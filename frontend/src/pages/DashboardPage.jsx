import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  CloudSun,
  MapPinned,
  Plus,
  Sparkles,
  Warehouse,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucherLocationMap } from '@/components/map/RucherLocationMap'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeather } from '@/contexts/WeatherContext'
import { formatCoordinate, getRucherPosition } from '@/hooks/useRucherLocation'
import { useRuchers } from '@/hooks/useRuchers'
import { useRuches } from '@/hooks/useRuches'
import { cn } from '@/lib/utils'

const statusFilters = [
  { value: 'all', labelKey: 'dashboard.statusFilter.all' },
  { value: 'active', labelKey: 'dashboard.statusFilter.active' },
  { value: 'en_observation', labelKey: 'dashboard.statusFilter.en_observation' },
  { value: 'inactive', labelKey: 'dashboard.statusFilter.inactive' },
]

const statusStyles = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/12 dark:text-emerald-200',
  en_observation: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/12 dark:text-amber-200',
  inactive: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/12 dark:text-slate-200',
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(Number(value) || 0)
}

function formatTemperature(value, unit = '°C') {
  if (!Number.isFinite(Number(value))) {
    return '—'
  }

  return `${formatNumber(value)} ${unit}`
}

function getPercent(value, total) {
  if (!total) {
    return 0
  }

  return Math.min(100, Math.round((value / total) * 100))
}

function MetricCard({ icon, title, value, detail, tone = 'default' }) {
  const MetricIcon = icon
  const toneClasses = {
    default: 'bg-primary/10 text-primary',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
    blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  }

  return (
    <Card className="bg-card/95 shadow-md shadow-foreground/5">
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-4xl font-bold">{value}</CardTitle>
        </div>
        <div className={cn('flex size-12 items-center justify-center rounded-2xl', toneClasses[tone])}>
          <MetricIcon className="size-6" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-7 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function ProgressBar({ value, className }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className={cn('h-full rounded-full bg-primary transition-all', className)} style={{ width: `${value}%` }} />
    </div>
  )
}

function StatusBadge({ status }) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={cn('capitalize', statusStyles[status])}>
      {t(`ruche.status.${status}Full`, { defaultValue: status })}
    </Badge>
  )
}

export function DashboardPage() {
  const ruchersState = useRuchers()
  const ruchesState = useRuches()
  const { t } = useTranslation()
  const {
    fetchWeatherForRucher,
    latestReport,
    pendingRucherId,
    primeWeatherReportsFromRuchers,
    reports,
    weatherByRucherId,
  } = useWeather()
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRucherId, setSelectedRucherId] = useState(null)

  const dashboard = useMemo(() => {
    const ruchers = ruchersState.ruchers
    const ruches = ruchesState.ruches
    const totalEmplacements = ruchers.reduce((sum, rucher) => sum + Number(rucher.nb_emplacements ?? 0), 0)
    const activeRuches = ruches.filter((ruche) => ruche.statut === 'active').length
    const observationRuches = ruches.filter((ruche) => ruche.statut === 'en_observation').length
    const inactiveRuches = ruches.filter((ruche) => ruche.statut === 'inactive').length
    const filteredRuches = statusFilter === 'all'
      ? ruches
      : ruches.filter((ruche) => ruche.statut === statusFilter)

    const ruchersWithStats = ruchers
      .map((rucher) => {
        const ruchesForRucher = ruches.filter((ruche) => String(ruche.rucher_id) === String(rucher.id))
        const capacity = Number(rucher.nb_emplacements ?? 0)
        const occupancy = getPercent(ruchesForRucher.length, capacity)

        return {
          ...rucher,
          capacity,
          ruchesCount: ruchesForRucher.length,
          occupancy,
          activeCount: ruchesForRucher.filter((ruche) => ruche.statut === 'active').length,
          observationCount: ruchesForRucher.filter((ruche) => ruche.statut === 'en_observation').length,
          inactiveCount: ruchesForRucher.filter((ruche) => ruche.statut === 'inactive').length,
          position: getRucherPosition(rucher),
        }
      })
      .sort((left, right) => right.occupancy - left.occupancy)

    return {
      ruchers,
      ruches,
      filteredRuches,
      ruchersWithStats,
      totalEmplacements,
      activeRuches,
      observationRuches,
      inactiveRuches,
      availableSlots: Math.max(totalEmplacements - ruches.length, 0),
      globalOccupancy: getPercent(ruches.length, totalEmplacements),
    }
  }, [ruchersState.ruchers, ruchesState.ruches, statusFilter])

  const selectedRucher = dashboard.ruchersWithStats.find((rucher) => String(rucher.id) === String(selectedRucherId))
    ?? dashboard.ruchersWithStats[0]
    ?? null

  const selectedRuches = selectedRucher
    ? dashboard.ruches.filter((ruche) => String(ruche.rucher_id) === String(selectedRucher.id))
    : []
  const selectedWeatherReport = selectedRucher ? weatherByRucherId[selectedRucher.id] ?? null : null
  const mapMarkers = useMemo(() => dashboard.ruchersWithStats
    .filter((rucher) => rucher.position)
    .map((rucher) => ({
      id: rucher.id,
      label: t('dashboard.markerLabel', {
        name: rucher.name,
        hives: rucher.ruchesCount,
        capacity: rucher.capacity,
      }),
      position: rucher.position,
    })), [dashboard.ruchersWithStats, t])
  const businessAlerts = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const alerts = []

    for (const rucher of dashboard.ruchersWithStats) {
      if (rucher.capacity > 0 && rucher.ruchesCount >= rucher.capacity) {
        alerts.push({
          id: `full-${rucher.id}`,
          title: t('dashboard.alertFullTitle', { name: rucher.name }),
          detail: t('dashboard.alertFullDetail', {
            hives: rucher.ruchesCount,
            capacity: rucher.capacity,
          }),
          tone: 'amber',
        })
      }
    }

    for (const ruche of dashboard.ruches.filter((item) => item.statut === 'inactive').slice(0, 3)) {
      const rucher = dashboard.ruchers.find((item) => String(item.id) === String(ruche.rucher_id))
      alerts.push({
        id: `inactive-${ruche.id}`,
        title: t('dashboard.alertInactiveTitle', { name: ruche.name ?? ruche.nom }),
        detail: rucher ? t('dashboard.alertCheckIn', { name: rucher.name }) : t('dashboard.alertCheck'),
        tone: 'slate',
      })
    }

    for (const ruche of dashboard.ruches
      .filter((item) => item.annee_reine && currentYear - Number(item.annee_reine) >= 3)
      .slice(0, 3)) {
      alerts.push({
        id: `queen-${ruche.id}`,
        title: t('dashboard.alertOldQueenTitle', { name: ruche.name ?? ruche.nom }),
        detail: t('dashboard.alertOldQueenDetail', { year: ruche.annee_reine }),
        tone: 'amber',
      })
    }

    for (const report of reports.slice(0, 5)) {
      if (Number(report.windSpeed) >= 40) {
        alerts.push({
          id: `wind-${report.rucherId}-${report.fetchedAt}`,
          title: t('dashboard.alertWindTitle', { name: report.rucherName }),
          detail: `${formatNumber(report.windSpeed)} ${report.windSpeedUnit}.`,
          tone: 'sky',
        })
      }

      if (Number(report.temperature) <= 8 || Number(report.temperature) >= 35) {
        alerts.push({
          id: `temperature-${report.rucherId}-${report.fetchedAt}`,
          title: t('dashboard.alertTemperatureTitle', { name: report.rucherName }),
          detail: t('dashboard.alertTemperatureDetail', {
            temperature: formatTemperature(report.temperature, report.temperatureUnit),
          }),
          tone: 'sky',
        })
      }
    }

    return alerts.slice(0, 6)
  }, [dashboard.ruchers, dashboard.ruchersWithStats, dashboard.ruches, reports, t])

  useEffect(() => {
    primeWeatherReportsFromRuchers(ruchersState.ruchers)
  }, [primeWeatherReportsFromRuchers, ruchersState.ruchers])

  async function handleFetchWeather(rucher) {
    try {
      const report = await fetchWeatherForRucher(rucher, { force: true })
      toast.success(t('weather.success', {
        name: rucher.name,
        temperature: formatTemperature(report.temperature, report.temperatureUnit),
      }))
    } catch {
      toast.error(t('weather.apiError'))
    }
  }

  if (ruchersState.isLoading || ruchesState.isLoading) {
    return <LoadingState variant="dashboard" label={t('dashboard.loading')} />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 rounded-xl border bg-secondary p-6 text-secondary-foreground shadow-md shadow-foreground/8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-base text-foreground">
            <Sparkles className="size-5 text-primary" />
            {t('dashboard.kicker')}
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t('dashboard.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 opacity-80">
            {t('dashboard.description')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className={buttonVariants({ variant: 'outline' })} to="/ruchers">
            <MapPinned className="size-4" />
            {t('dashboard.manageApiaries')}
          </Link>
          <Link className={buttonVariants()} to="/ruches">
            <Plus className="size-4" />
            {t('dashboard.addHive')}
          </Link>
        </div>
      </div>

      <ApiErrorAlert error={ruchersState.error || ruchesState.error} />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={MapPinned}
          title={t('dashboard.trackedApiaries')}
          value={dashboard.ruchers.length}
          detail={t('dashboard.availableSlots', { count: dashboard.availableSlots })}
        />
        <MetricCard
          icon={Warehouse}
          title={t('dashboard.activeHives')}
          value={dashboard.activeRuches}
          detail={t('dashboard.hiveStatusDetail', {
            observation: dashboard.observationRuches,
            inactive: dashboard.inactiveRuches,
          })}
          tone="green"
        />
        <MetricCard
          icon={Activity}
          title={t('dashboard.globalOccupancy')}
          value={`${dashboard.globalOccupancy}%`}
          detail={t('dashboard.occupancyDetail', {
            hives: dashboard.ruches.length,
            slots: dashboard.totalEmplacements,
          })}
          tone="amber"
        />
        <MetricCard
          icon={CloudSun}
          title={t('dashboard.checkedWeather')}
          value={reports.length}
          detail={latestReport ? `${latestReport.rucherName} · ${formatTemperature(latestReport.temperature, latestReport.temperatureUnit)}` : t('dashboard.noManualWeather')}
          tone="blue"
        />
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)]">
        <Card className="bg-card/95 shadow-md shadow-foreground/5">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>{t('dashboard.colonies')}</CardTitle>
                <CardDescription>{t('dashboard.coloniesDescription')}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-1 rounded-lg border bg-background p-1">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    type="button"
                    size="sm"
                    variant={statusFilter === filter.value ? 'default' : 'ghost'}
                    onClick={() => setStatusFilter(filter.value)}
                  >
                    {t(filter.labelKey)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-emerald-50/70 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-sm text-emerald-700 dark:text-emerald-200">{t('dashboard.statusFilter.active')}</p>
                <p className="mt-1 text-2xl font-semibold">{dashboard.activeRuches}</p>
              </div>
              <div className="rounded-lg border bg-amber-50/70 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                <p className="text-sm text-amber-700 dark:text-amber-200">{t('dashboard.statusFilter.en_observation')}</p>
                <p className="mt-1 text-2xl font-semibold">{dashboard.observationRuches}</p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3 dark:border-slate-500/20 dark:bg-slate-500/10">
                <p className="text-sm text-slate-700 dark:text-slate-200">{t('dashboard.statusFilter.inactive')}</p>
                <p className="mt-1 text-2xl font-semibold">{dashboard.inactiveRuches}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t('dashboard.slotOccupancy')}</span>
                <span className="text-muted-foreground">{dashboard.globalOccupancy}%</span>
              </div>
              <ProgressBar value={dashboard.globalOccupancy} className="bg-amber-500" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {t('dashboard.displayedHives', { count: dashboard.filteredRuches.length })}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {dashboard.filteredRuches.slice(0, 8).map((ruche) => {
                  const rucher = dashboard.ruchers.find((item) => String(item.id) === String(ruche.rucher_id))

                  return (
                    <div key={ruche.id} className="rounded-lg border bg-background/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{ruche.name ?? ruche.nom}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{rucher?.name ?? t('ruches.noApiary')}</p>
                        </div>
                        <StatusBadge status={ruche.statut} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 shadow-md shadow-foreground/5">
          <CardHeader>
            <CardTitle>{t('dashboard.selectedApiary')}</CardTitle>
            <CardDescription>{t('dashboard.selectedApiaryDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRucher ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {dashboard.ruchersWithStats.map((rucher) => (
                    <Button
                      key={rucher.id}
                      type="button"
                      size="sm"
                      variant={selectedRucher.id === rucher.id ? 'default' : 'outline'}
                      onClick={() => setSelectedRucherId(rucher.id)}
                    >
                      {rucher.name}
                    </Button>
                  ))}
                </div>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedRucher.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedRucher.position
                          ? `${formatCoordinate(selectedRucher.position.lat)}, ${formatCoordinate(selectedRucher.position.lng)}`
                          : t('rucher.coordinatesMissing')}
                      </p>
                      {selectedWeatherReport ? (
                        <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-2.5 py-1 text-sm font-medium text-sky-700 dark:bg-sky-500/12 dark:text-sky-200">
                          <CloudSun className="size-4" />
                          {formatTemperature(
                            selectedWeatherReport.temperature,
                            selectedWeatherReport.temperatureUnit,
                          )}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleFetchWeather(selectedRucher)}
                        disabled={!selectedRucher.position || pendingRucherId === selectedRucher.id}
                      >
                        <CloudSun className="size-4" />
                        {pendingRucherId === selectedRucher.id ? t('weather.loadingShort') : t('weather.column')}
                      </Button>
                      <Link
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                        to={`/ruchers/${selectedRucher.id}`}
                      >
                        {t('common.open')}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t('dashboard.usedCapacity')}</span>
                      <span className="font-medium">
                        {selectedRucher.ruchesCount}/{selectedRucher.capacity}
                      </span>
                    </div>
                    <ProgressBar value={selectedRucher.occupancy} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200">
                      <p className="font-semibold">{selectedRucher.activeCount}</p>
                      <p className="text-xs">{t('dashboard.statusFilter.active')}</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-2 text-amber-700 dark:bg-amber-500/12 dark:text-amber-200">
                      <p className="font-semibold">{selectedRucher.observationCount}</p>
                      <p className="text-xs">{t('dashboard.statusFilter.en_observation')}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 text-slate-700 dark:bg-slate-500/12 dark:text-slate-200">
                      <p className="font-semibold">{selectedRucher.inactiveCount}</p>
                      <p className="text-xs">{t('dashboard.statusFilter.inactive')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('dashboard.apiaryColonies')}</p>
                  {selectedRuches.length > 0 ? (
                    selectedRuches.slice(0, 5).map((ruche) => (
                      <div key={ruche.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{ruche.name ?? ruche.nom}</p>
                          <p className="text-xs text-muted-foreground">{ruche.type_ruche}</p>
                        </div>
                        <StatusBadge status={ruche.statut} />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      {t('ruches.noneForApiary')}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                {t('dashboard.createApiaryPrompt')}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="bg-card/95 shadow-md shadow-foreground/5">
          <CardHeader>
            <CardTitle>{t('dashboard.businessAlerts')}</CardTitle>
            <CardDescription>{t('dashboard.businessAlertsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {businessAlerts.length > 0 ? (
              businessAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-lg border p-3',
                    alert.tone === 'amber' && 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/12 dark:text-amber-100',
                    alert.tone === 'slate' && 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-500/30 dark:bg-slate-500/12 dark:text-slate-100',
                    alert.tone === 'sky' && 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/12 dark:text-sky-100',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="mt-1 text-sm opacity-80">{alert.detail}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                {t('dashboard.noAlerts')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/95 shadow-md shadow-foreground/5">
          <CardHeader>
            <CardTitle>{t('dashboard.globalMap')}</CardTitle>
            <CardDescription>{t('dashboard.globalMapDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {mapMarkers.length > 0 ? (
              <RucherLocationMap className="h-96" disabled markers={mapMarkers} />
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                {t('dashboard.mapEmpty')}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
