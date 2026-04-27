import { useState } from 'react'
import { toast } from 'sonner'
import { Link, useParams } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { LoadingState } from '@/components/feedback/LoadingState'
import { RucheDialog } from '@/components/ruches/RucheDialog'
import { RucheTable } from '@/components/ruches/RucheTable'
import { useAuth } from '@/contexts/AuthContext'
import { useRucher } from '@/hooks/useRucher'
import { useRuchers } from '@/hooks/useRuchers'
import { useRuches } from '@/hooks/useRuches'
import { deleteRuche } from '@/services/ruchesApi'

export function RucherDetailPage() {
  const { rucherId } = useParams()
  const { token } = useAuth()
  const [editingRuche, setEditingRuche] = useState(null)
  const [mutationError, setMutationError] = useState(null)
  const rucherState = useRucher(rucherId)
  const ruchersState = useRuchers()
  const ruchesState = useRuches({ rucherId })

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
    return <LoadingState label="Chargement du rucher..." />
  }

  return (
    <div className="space-y-6">
      <Link className={buttonVariants({ variant: 'outline' })} to="/ruchers">
        Retour aux ruchers
      </Link>
      <ApiErrorAlert error={rucherState.error || ruchesState.error || ruchersState.error || mutationError} />
      {rucherState.rucher && (
        <section className="rounded-lg border p-4">
          <h1 className="text-2xl font-semibold">{rucherState.rucher.name}</h1>
          <p className="text-sm text-muted-foreground">{rucherState.rucher.localisation}</p>
          {rucherState.rucher.description && <p className="mt-3 text-sm">{rucherState.rucher.description}</p>}
          <p className="mt-3 text-sm text-muted-foreground">
            {rucherState.rucher.nb_emplacements} emplacements
          </p>
        </section>
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
