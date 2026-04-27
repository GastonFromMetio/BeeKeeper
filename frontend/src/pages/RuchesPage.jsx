import { useState } from 'react'
import { toast } from 'sonner'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucheDialog } from '@/components/ruches/RucheDialog'
import { RucheTable } from '@/components/ruches/RucheTable'
import { useAuth } from '@/contexts/AuthContext'
import { useRuchers } from '@/hooks/useRuchers'
import { useRuches } from '@/hooks/useRuches'
import { deleteRuche } from '@/services/ruchesApi'

export function RuchesPage() {
  const { token } = useAuth()
  const [editingRuche, setEditingRuche] = useState(null)
  const [mutationError, setMutationError] = useState(null)
  const ruchersState = useRuchers()
  const ruchesState = useRuches()

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

  if (ruchersState.isLoading || ruchesState.isLoading) {
    return <LoadingState label="Chargement des ruches..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ruches</h1>
          <p className="text-sm text-muted-foreground">Gestion des colonies.</p>
        </div>
        <RucheDialog ruchers={ruchersState.ruchers} onSaved={ruchesState.refetch} />
      </div>
      <ApiErrorAlert error={ruchersState.error || ruchesState.error || mutationError} />
      {ruchesState.ruches.length === 0 ? (
        <EmptyState title="Aucune ruche" description="Créez votre première ruche." />
      ) : (
        <RucheTable
          ruches={ruchesState.ruches}
          ruchers={ruchersState.ruchers}
          onEdit={setEditingRuche}
          onDelete={handleDelete}
        />
      )}
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
