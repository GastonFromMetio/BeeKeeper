import { useState } from 'react'
import { toast } from 'sonner'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { EmptyState } from '@/components/feedback/EmptyState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucherDialog } from '@/components/ruchers/RucherDialog'
import { RucherTable } from '@/components/ruchers/RucherTable'
import { useAuth } from '@/contexts/AuthContext'
import { useRuchers } from '@/hooks/useRuchers'
import { deleteRucher } from '@/services/ruchersApi'

export function RuchersPage() {
  const { token } = useAuth()
  const { ruchers, isLoading, error, refetch } = useRuchers()
  const [editingRucher, setEditingRucher] = useState(null)
  const [mutationError, setMutationError] = useState(null)

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

  if (isLoading) return <LoadingState label="Chargement des ruchers..." />

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
        <RucherTable ruchers={ruchers} onEdit={setEditingRucher} onDelete={handleDelete} />
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
