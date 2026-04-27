import { useState } from 'react'
import { toast } from 'sonner'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { createRuche, updateRuche } from '@/services/ruchesApi'
import { RucheForm } from './RucheForm'

export function RucheDialog({
  ruche,
  ruchers,
  initialValues,
  onSaved,
  triggerLabel = 'Nouvelle ruche',
  open,
  onOpenChange,
}) {
  const { token } = useAuth()
  const [internalOpen, setInternalOpen] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = Boolean(ruche)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  async function handleSubmit(payload) {
    try {
      setError(null)
      if (isEdit) {
        await updateRuche(token, ruche.id, payload)
        toast.success('Ruche modifiée')
      } else {
        await createRuche(token, payload)
        toast.success('Ruche créée')
      }
      setOpen(false)
      await onSaved?.()
    } catch (apiError) {
      setError(apiError)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger render={<Button type="button" />}>
          {triggerLabel}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la ruche' : 'Créer une ruche'}</DialogTitle>
        </DialogHeader>
        <ApiErrorAlert error={error} />
        <RucheForm
          ruchers={ruchers}
          initialValues={ruche ?? initialValues}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? 'Modifier' : 'Créer'}
        />
      </DialogContent>
    </Dialog>
  )
}
