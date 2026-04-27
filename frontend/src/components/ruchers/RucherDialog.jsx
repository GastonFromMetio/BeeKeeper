import { useState } from 'react'
import { toast } from 'sonner'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { createRucher, updateRucher } from '@/services/ruchersApi'
import { RucherForm } from './RucherForm'

export function RucherDialog({
  rucher,
  onSaved,
  triggerLabel = 'Nouveau rucher',
  open,
  onOpenChange,
}) {
  const { token } = useAuth()
  const [internalOpen, setInternalOpen] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = Boolean(rucher)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  async function handleSubmit(payload) {
    try {
      setError(null)
      if (isEdit) {
        await updateRucher(token, rucher.id, payload)
        toast.success('Rucher modifié')
      } else {
        await createRucher(token, payload)
        toast.success('Rucher créé')
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
          <DialogTitle>{isEdit ? 'Modifier le rucher' : 'Créer un rucher'}</DialogTitle>
        </DialogHeader>
        <ApiErrorAlert error={error} />
        <RucherForm initialValues={rucher} onSubmit={handleSubmit} submitLabel={isEdit ? 'Modifier' : 'Créer'} />
      </DialogContent>
    </Dialog>
  )
}
