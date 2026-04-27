import { TriangleAlert } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'

function flattenErrors(errors) {
  return Object.values(errors ?? {}).flat().filter(Boolean)
}

export function ApiErrorAlert({ error }) {
  const { t } = useTranslation()

  if (!error) {
    return null
  }

  const details = flattenErrors(error.errors)

  return (
    <Alert variant="destructive">
      <TriangleAlert className="size-4" />
      <AlertTitle>{error.message || t('errors.generic')}</AlertTitle>
      {details.length > 0 && (
        <AlertDescription>
          <ul className="ml-4 list-disc space-y-1">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </AlertDescription>
      )}
    </Alert>
  )
}
