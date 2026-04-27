import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucherSummaryCards } from '@/components/ruchers/RucherSummaryCards'
import { useRuchers } from '@/hooks/useRuchers'
import { useRuches } from '@/hooks/useRuches'

export function DashboardPage() {
  const ruchersState = useRuchers()
  const ruchesState = useRuches()

  if (ruchersState.isLoading || ruchesState.isLoading) {
    return <LoadingState label="Chargement du tableau de bord..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Vue globale de vos ruchers et ruches.</p>
      </div>
      <ApiErrorAlert error={ruchersState.error || ruchesState.error} />
      <RucherSummaryCards ruchers={ruchersState.ruchers} ruches={ruchesState.ruches} />
    </div>
  )
}
