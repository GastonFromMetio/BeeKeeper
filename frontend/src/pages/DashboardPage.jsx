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
  { value: 'all', label: 'Toutes' },
  { value: 'active', label: 'Actives' },
  { value: 'en_observation', label: 'Observation' },
  { value: 'inactive', label: 'Inactives' },
]

const statusLabels = {
  active: 'Active',
  en_observation: 'En observation',
  inactive: 'Inactive',
}

const statusStyles = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  en_observation: 'border-amber-200 bg-amber-50 text-amber-700',
  inactive: 'border-slate-200 bg-slate-50 text-slate-700',
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
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
  }

  return (
    <Card className="bg-white/95 shadow-sm">
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-3">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-1 text-3xl font-semibold">{value}</CardTitle>
        </div>
        <div className={cn('flex size-10 items-center justify-center rounded-lg', toneClasses[tone])}>
          <MetricIcon className="size-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
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
  return (
    <Badge variant="outline" className={cn('capitalize', statusStyles[status])}>
      {statusLabels[status] ?? status}
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
      label: `${rucher.name} · ${rucher.ruchesCount}/${rucher.capacity} emplacements`,
      position: rucher.position,
    })), [dashboard.ruchersWithStats])
  const businessAlerts = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const alerts = []

    for (const rucher of dashboard.ruchersWithStats) {
      if (rucher.capacity > 0 && rucher.ruchesCount >= rucher.capacity) {
        alerts.push({
          id: `full-${rucher.id}`,
          title: `${rucher.name} est plein`,
          detail: `${rucher.ruchesCount}/${rucher.capacity} emplacements occupés.`,
          tone: 'amber',
        })
      }
    }

    for (const ruche of dashboard.ruches.filter((item) => item.statut === 'inactive').slice(0, 3)) {
      const rucher = dashboard.ruchers.find((item) => String(item.id) === String(ruche.rucher_id))
      alerts.push({
        id: `inactive-${ruche.id}`,
        title: `${ruche.name ?? ruche.nom} inactive`,
        detail: rucher ? `À vérifier dans ${rucher.name}.` : 'À vérifier.',
        tone: 'slate',
      })
    }

    for (const ruche of dashboard.ruches
      .filter((item) => item.annee_reine && currentYear - Number(item.annee_reine) >= 3)
      .slice(0, 3)) {
      alerts.push({
        id: `queen-${ruche.id}`,
        title: `Reine ancienne sur ${ruche.name ?? ruche.nom}`,
        detail: `Année reine ${ruche.annee_reine}. Prévoir un contrôle.`,
        tone: 'amber',
      })
    }

    for (const report of reports.slice(0, 5)) {
      if (Number(report.windSpeed) >= 40) {
        alerts.push({
          id: `wind-${report.rucherId}-${report.fetchedAt}`,
          title: `Vent fort sur ${report.rucherName}`,
          detail: `${formatNumber(report.windSpeed)} ${report.windSpeedUnit}.`,
          tone: 'sky',
        })
      }

      if (Number(report.temperature) <= 8 || Number(report.temperature) >= 35) {
        alerts.push({
          id: `temperature-${report.rucherId}-${report.fetchedAt}`,
          title: `Température à surveiller sur ${report.rucherName}`,
          detail: `${formatTemperature(report.temperature, report.temperatureUnit)} relevés.`,
          tone: 'sky',
        })
      }
    }

    return alerts.slice(0, 6)
  }, [dashboard.ruchers, dashboard.ruchersWithStats, dashboard.ruches, reports])

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
    return <LoadingState variant="dashboard" label="Chargement du tableau de bord..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border bg-white/80 px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Pilotage apicole
          </div>
          <h1 className="text-3xl font-semibold leading-tight">Tableau de bord opérationnel</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Suivez la capacité des ruchers, les colonies à surveiller et les derniers relevés météo consultés.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className={buttonVariants({ variant: 'outline' })} to="/ruchers">
            <MapPinned className="size-4" />
            Gérer les ruchers
          </Link>
          <Link className={buttonVariants()} to="/ruches">
            <Plus className="size-4" />
            Ajouter une ruche
          </Link>
        </div>
      </div>

      <ApiErrorAlert error={ruchersState.error || ruchesState.error} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={MapPinned}
          title="Ruchers suivis"
          value={dashboard.ruchers.length}
          detail={`${dashboard.availableSlots} emplacements encore disponibles`}
        />
        <MetricCard
          icon={Warehouse}
          title="Ruches actives"
          value={dashboard.activeRuches}
          detail={`${dashboard.observationRuches} en observation, ${dashboard.inactiveRuches} inactives`}
          tone="green"
        />
        <MetricCard
          icon={Activity}
          title="Occupation globale"
          value={`${dashboard.globalOccupancy}%`}
          detail={`${dashboard.ruches.length} ruches pour ${dashboard.totalEmplacements} emplacements`}
          tone="amber"
        />
        <MetricCard
          icon={CloudSun}
          title="Météo consultée"
          value={reports.length}
          detail={latestReport ? `${latestReport.rucherName} · ${formatTemperature(latestReport.temperature, latestReport.temperatureUnit)}` : 'Aucun relevé manuel'}
          tone="blue"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
        <Card className="bg-white/95 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>Colonies</CardTitle>
                <CardDescription>Filtrez les ruches par état pour isoler les actions à mener.</CardDescription>
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
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border bg-emerald-50/70 p-3">
                <p className="text-sm text-emerald-700">Actives</p>
                <p className="mt-1 text-2xl font-semibold">{dashboard.activeRuches}</p>
              </div>
              <div className="rounded-lg border bg-amber-50/70 p-3">
                <p className="text-sm text-amber-700">En observation</p>
                <p className="mt-1 text-2xl font-semibold">{dashboard.observationRuches}</p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <p className="text-sm text-slate-700">Inactives</p>
                <p className="mt-1 text-2xl font-semibold">{dashboard.inactiveRuches}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Occupation des emplacements</span>
                <span className="text-muted-foreground">{dashboard.globalOccupancy}%</span>
              </div>
              <ProgressBar value={dashboard.globalOccupancy} className="bg-amber-500" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {dashboard.filteredRuches.length} ruche{dashboard.filteredRuches.length > 1 ? 's' : ''} affichée{dashboard.filteredRuches.length > 1 ? 's' : ''}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {dashboard.filteredRuches.slice(0, 8).map((ruche) => {
                  const rucher = dashboard.ruchers.find((item) => String(item.id) === String(ruche.rucher_id))

                  return (
                    <div key={ruche.id} className="rounded-lg border bg-background/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{ruche.name ?? ruche.nom}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{rucher?.name ?? 'Rucher inconnu'}</p>
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

        <Card className="bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>Rucher sélectionné</CardTitle>
            <CardDescription>Vue rapide de la capacité, des coordonnées et des colonies.</CardDescription>
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
                          : 'Coordonnées non renseignées'}
                      </p>
                      {selectedWeatherReport ? (
                        <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-2.5 py-1 text-sm font-medium text-sky-700">
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
                        {pendingRucherId === selectedRucher.id ? 'Consultation...' : 'Météo'}
                      </Button>
                      <Link
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                        to={`/ruchers/${selectedRucher.id}`}
                      >
                        Ouvrir
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Capacité utilisée</span>
                      <span className="font-medium">
                        {selectedRucher.ruchesCount}/{selectedRucher.capacity}
                      </span>
                    </div>
                    <ProgressBar value={selectedRucher.occupancy} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                      <p className="font-semibold">{selectedRucher.activeCount}</p>
                      <p className="text-xs">Actives</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                      <p className="font-semibold">{selectedRucher.observationCount}</p>
                      <p className="text-xs">Observation</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 text-slate-700">
                      <p className="font-semibold">{selectedRucher.inactiveCount}</p>
                      <p className="text-xs">Inactives</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Colonies du rucher</p>
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
                      Aucune ruche associée à ce rucher.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                Créez un rucher pour alimenter le tableau de bord.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>Alertes métier</CardTitle>
            <CardDescription>Détection simple des situations qui demandent un contrôle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {businessAlerts.length > 0 ? (
              businessAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-lg border p-3',
                    alert.tone === 'amber' && 'border-amber-200 bg-amber-50 text-amber-800',
                    alert.tone === 'slate' && 'border-slate-200 bg-slate-50 text-slate-800',
                    alert.tone === 'sky' && 'border-sky-200 bg-sky-50 text-sky-800',
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
                Aucune alerte prioritaire avec les données actuelles.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>Carte globale</CardTitle>
            <CardDescription>Position de tous les ruchers renseignés.</CardDescription>
          </CardHeader>
          <CardContent>
            {mapMarkers.length > 0 ? (
              <RucherLocationMap className="h-96" disabled markers={mapMarkers} />
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                Ajoutez des coordonnées GPS à vos ruchers pour les afficher ici.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
