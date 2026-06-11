import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  triggerLabel,
  open,
  onOpenChange,
}) {
  const { token } = useAuth()
  const { t } = useTranslation()
  const [internalOpen, setInternalOpen] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = Boolean(rucher)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const resolvedTriggerLabel = triggerLabel === undefined ? t('ruchers.new') : triggerLabel

  async function handleSubmit(payload) {
    try {
      setError(null)
      if (isEdit) {
        await updateRucher(token, rucher.id, payload)
        toast.success(t('ruchers.updated'))
      } else {
        await createRucher(token, payload)
        toast.success(t('ruchers.created'))
      }
      setOpen(false)
      await onSaved?.()
    } catch (apiError) {
      setError(apiError)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {resolvedTriggerLabel && (
        <DialogTrigger render={<Button type="button" />}>
          {resolvedTriggerLabel}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('ruchers.editTitle') : t('ruchers.createTitle')}</DialogTitle>
        </DialogHeader>
        <ApiErrorAlert error={error} />
        <RucherForm
          initialValues={rucher}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? t('ruchers.edit') : t('ruchers.create')}
        />
      </DialogContent>
    </Dialog>
  )
}
