import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucherDialog } from '@/components/ruchers/RucherDialog'
import { RucherTable } from '@/components/ruchers/RucherTable'
import { useAuth } from '@/contexts/AuthContext'
import { useWeather } from '@/contexts/WeatherContext'
import { getRucherPosition } from '@/hooks/useRucherLocation'
import { useRuchers } from '@/hooks/useRuchers'
import { deleteRucher } from '@/services/ruchersApi'

export function RuchersPage() {
  const { token } = useAuth()
  const { ruchers, isLoading, error, refetch } = useRuchers()
  const { fetchWeatherForRucher, getWeatherReport, weatherByRucherId, pendingRucherId } = useWeather()
  const [editingRucher, setEditingRucher] = useState(null)
  const [mutationError, setMutationError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadWeather() {
      for (const rucher of ruchers) {
        if (cancelled) {
          return
        }

        if (getWeatherReport(rucher.id)) {
          continue
        }

        if (!getRucherPosition(rucher)) {
          continue
        }

        try {
          await fetchWeatherForRucher(rucher)
        } catch {
          // Weather is additive. Keep the list usable even if Open-Meteo fails.
        }
      }
    }

    loadWeather()

    return () => {
      cancelled = true
    }
  }, [fetchWeatherForRucher, getWeatherReport, ruchers])

  async function handleDelete(rucher) {
    if (!window.confirm(`Supprimer ${rucher.name} ?`)) return

    try {
      setMutationError(null)
      await deleteRucher(token, rucher.id)
      toast.success('Rucher supprimé')
      await refetch()
    } catch (apiError) {
      setMutationError(apiError)
    }
  }

  if (isLoading) return <LoadingState variant="table" columns={5} label="Chargement des ruchers..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ruchers</h1>
          <p className="text-sm text-muted-foreground">Gestion des emplacements.</p>
        </div>
        <RucherDialog onSaved={refetch} />
      </div>
      <ApiErrorAlert error={error || mutationError} />
      {ruchers.length === 0 ? (
        <EmptyState title="Aucun rucher" description="Créez votre premier rucher." />
      ) : (
        <RucherTable
          ruchers={ruchers}
          onEdit={setEditingRucher}
          onDelete={handleDelete}
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
