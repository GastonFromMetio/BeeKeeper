import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Link, useParams } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucherLocationMap } from '@/components/map/RucherLocationMap'
import { RucheDialog } from '@/components/ruches/RucheDialog'
import { RucheTable } from '@/components/ruches/RucheTable'
import { useAuth } from '@/contexts/AuthContext'
import { useWeather } from '@/contexts/WeatherContext'
import { RucherWeatherCard } from '@/components/weather/RucherWeatherCard'
import { useRucher } from '@/hooks/useRucher'
import { formatCoordinate, getRucherPosition } from '@/hooks/useRucherLocation'
import { useRuchers } from '@/hooks/useRuchers'
import { useRuches } from '@/hooks/useRuches'
import { deleteRuche } from '@/services/ruchesApi'

export function RucherDetailPage() {
  const { rucherId } = useParams()
  const { token } = useAuth()
  const { fetchWeatherForRucher, getWeatherReport, pendingRucherId } = useWeather()
  const [editingRuche, setEditingRuche] = useState(null)
  const [mutationError, setMutationError] = useState(null)
  const rucherState = useRucher(rucherId)
  const ruchersState = useRuchers()
  const ruchesState = useRuches({ rucherId })
  const rucherPosition = getRucherPosition(rucherState.rucher)
  const weatherReport = rucherState.rucher ? getWeatherReport(rucherState.rucher.id) : null

  useEffect(() => {
    if (!rucherState.rucher) {
      return
    }

    if (weatherReport || !rucherPosition) {
      return
    }

    void fetchWeatherForRucher(rucherState.rucher).catch(() => {
      // On garde la fiche accessible même si le service météo est indisponible.
    })
  }, [fetchWeatherForRucher, rucherPosition, rucherState.rucher, weatherReport])

  async function handleDelete(ruche) {
    const rucheName = ruche.name ?? ruche.nom
    if (!window.confirm(`Supprimer ${rucheName} ?`)) return

    try {
      setMutationError(null)
      await deleteRuche(token, ruche.id)
      toast.success('Ruche supprimée')
      await ruchesState.refetch()
    } catch (apiError) {
      setMutationError(apiError)
    }
  }

  if (rucherState.isLoading || ruchesState.isLoading) {
    return <LoadingState variant="detail" label="Chargement du rucher..." />
  }

  return (
    <div className="space-y-6">
      <Link className={buttonVariants({ variant: 'outline' })} to="/ruchers">
        Retour aux ruchers
      </Link>
      <ApiErrorAlert error={rucherState.error || ruchesState.error || ruchersState.error || mutationError} />
      {rucherState.rucher && (
        <>
          <section className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]">
          <div>
            <h1 className="text-2xl font-semibold">{rucherState.rucher.name}</h1>
            {rucherPosition && (
              <p className="mt-2 text-xs text-muted-foreground">
                {formatCoordinate(rucherPosition.lat)}, {formatCoordinate(rucherPosition.lng)}
              </p>
            )}
            {rucherState.rucher.description && <p className="mt-3 text-sm">{rucherState.rucher.description}</p>}
            <p className="mt-3 text-sm text-muted-foreground">
              {rucherState.rucher.nb_emplacements} emplacements
            </p>
          </div>
          {rucherPosition && (
            <RucherLocationMap className="h-72" disabled position={rucherPosition} />
          )}
          </section>
          <RucherWeatherCard
            report={weatherReport}
            isLoading={pendingRucherId === rucherState.rucher.id && !weatherReport}
          />
        </>
      )}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Ruches du rucher</h2>
          <RucheDialog
            ruchers={ruchersState.ruchers}
            initialValues={{ rucher_id: rucherId }}
            onSaved={ruchesState.refetch}
          />
        </div>
        <RucheTable
          ruches={ruchesState.ruches}
          ruchers={ruchersState.ruchers}
          onEdit={setEditingRuche}
          onDelete={handleDelete}
        />
      </section>
      {editingRuche && (
        <RucheDialog
          ruche={editingRuche}
          ruchers={ruchersState.ruchers}
          triggerLabel={null}
          open={Boolean(editingRuche)}
          onOpenChange={(open) => {
            if (!open) setEditingRuche(null)
          }}
          onSaved={async () => {
            setEditingRuche(null)
            await ruchesState.refetch()
          }}
        />
      )}
    </div>
  )
}
