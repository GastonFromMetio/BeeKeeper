import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  triggerLabel,
  open,
  onOpenChange,
}) {
  const { token } = useAuth()
  const { t } = useTranslation()
  const [internalOpen, setInternalOpen] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = Boolean(ruche)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const resolvedTriggerLabel = triggerLabel === undefined ? t('ruches.new') : triggerLabel

  async function handleSubmit(payload) {
    try {
      setError(null)
      if (isEdit) {
        await updateRuche(token, ruche.id, payload)
        toast.success(t('ruches.updated'))
      } else {
        await createRuche(token, payload)
        toast.success(t('ruches.created'))
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('ruches.editTitle') : t('ruches.createTitle')}</DialogTitle>
        </DialogHeader>
        <ApiErrorAlert error={error} />
        <RucheForm
          ruchers={ruchers}
          initialValues={ruche ?? initialValues}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? t('ruches.edit') : t('ruches.create')}
        />
      </DialogContent>
    </Dialog>
  )
}
