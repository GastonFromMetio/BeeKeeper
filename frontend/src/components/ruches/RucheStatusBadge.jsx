import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'

export function RucheStatusBadge({ statut }) {
  const { t } = useTranslation()
  const variant = statut === 'active' ? 'default' : statut === 'inactive' ? 'secondary' : 'outline'

  return <Badge variant={variant}>{t(`ruche.status.${statut}`, { defaultValue: statut })}</Badge>
}
