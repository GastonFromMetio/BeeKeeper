import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucherDialog } from '@/components/ruchers/RucherDialog'
import { RucherTable } from '@/components/ruchers/RucherTable'
import { useAuth } from '@/contexts/AuthContext'
import { useWeather } from '@/contexts/WeatherContext'
import { useRuchers } from '@/hooks/useRuchers'
import { deleteRucher } from '@/services/ruchersApi'
import { useTranslation } from 'react-i18next'

function formatTemperature(value, unit = '°C') {
  if (!Number.isFinite(Number(value))) {
    return '—'
  }

  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  })

  return `${formatter.format(Number(value))} ${unit}`
}

export function RuchersPage() {
  const { token } = useAuth()
  const { t } = useTranslation()
  const { ruchers, isLoading, error, refetch } = useRuchers()
  const {
    fetchWeatherForRucher,
    pendingRucherId,
    primeWeatherReportsFromRuchers,
    weatherByRucherId,
  } = useWeather()
  const [editingRucher, setEditingRucher] = useState(null)
  const [mutationError, setMutationError] = useState(null)

  useEffect(() => {
    primeWeatherReportsFromRuchers(ruchers)
  }, [primeWeatherReportsFromRuchers, ruchers])

  async function handleDelete(rucher) {
    if (!window.confirm(t('ruchers.confirmDelete', { name: rucher.name }))) return

    try {
      setMutationError(null)
      await deleteRucher(token, rucher.id)
      toast.success(t('ruchers.deleted'))
      await refetch()
    } catch (apiError) {
      setMutationError(apiError)
    }
  }

  async function handleFetchWeather(rucher) {
    try {
      setMutationError(null)
      const report = await fetchWeatherForRucher(rucher, { force: true })
      toast.success(t('weather.success', {
        name: rucher.name,
        temperature: formatTemperature(report.temperature, report.temperatureUnit),
      }))
    } catch (apiError) {
      toast.error(t('weather.apiError'))
      setMutationError(apiError)
    }
  }

  if (isLoading) return <LoadingState variant="table" columns={5} label={t('ruchers.loading')} />

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border bg-secondary p-6 text-secondary-foreground shadow-md shadow-foreground/8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">{t('ruchers.title')}</h1>
          <p className="mt-2 text-lg opacity-80">{t('ruchers.description')}</p>
        </div>
        <RucherDialog onSaved={refetch} />
      </div>
      <ApiErrorAlert error={error || mutationError} />
      {ruchers.length === 0 ? (
        <EmptyState title={t('ruchers.emptyTitle')} description={t('ruchers.emptyDescription')} />
      ) : (
        <RucherTable
          ruchers={ruchers}
          onEdit={setEditingRucher}
          onDelete={handleDelete}
          onWeather={handleFetchWeather}
          weatherReportsByRucherId={weatherByRucherId}
          loadingRucherId={pendingRucherId}
        />
      )}
      {editingRucher && (
        <RucherDialog
          rucher={editingRucher}
          triggerLabel={null}
          open={Boolean(editingRucher)}
          onOpenChange={(open) => {
            if (!open) setEditingRucher(null)
          }}
          onSaved={async () => {
            setEditingRucher(null)
            await refetch()
          }}
        />
      )}
    </div>
  )
}
