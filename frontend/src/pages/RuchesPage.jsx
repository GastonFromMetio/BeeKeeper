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
import { useTranslation } from 'react-i18next'

export function RuchesPage() {
  const { token } = useAuth()
  const { t } = useTranslation()
  const [editingRuche, setEditingRuche] = useState(null)
  const [mutationError, setMutationError] = useState(null)
  const ruchersState = useRuchers()
  const ruchesState = useRuches()

  async function handleDelete(ruche) {
    const rucheName = ruche.name ?? ruche.nom
    if (!window.confirm(t('ruches.confirmDelete', { name: rucheName }))) return

    try {
      setMutationError(null)
      await deleteRuche(token, ruche.id)
      toast.success(t('ruches.deleted'))
      await ruchesState.refetch()
    } catch (apiError) {
      setMutationError(apiError)
    }
  }

  if (ruchersState.isLoading || ruchesState.isLoading) {
    return <LoadingState variant="table" columns={6} label={t('ruches.loading')} />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border bg-secondary p-6 text-secondary-foreground shadow-md shadow-foreground/8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">{t('ruches.title')}</h1>
          <p className="mt-2 text-lg opacity-80">{t('ruches.description')}</p>
        </div>
        <RucheDialog ruchers={ruchersState.ruchers} onSaved={ruchesState.refetch} />
      </div>
      <ApiErrorAlert error={ruchersState.error || ruchesState.error || mutationError} />
      {ruchesState.ruches.length === 0 ? (
        <EmptyState title={t('ruches.emptyTitle')} description={t('ruches.emptyDescription')} />
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
