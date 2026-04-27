import { Badge } from '@/components/ui/badge'

const labels = {
  active: 'Active',
  en_observation: 'Observation',
  inactive: 'Inactive',
}

export function RucheStatusBadge({ statut }) {
  const variant = statut === 'active' ? 'default' : statut === 'inactive' ? 'secondary' : 'outline'

  return <Badge variant={variant}>{labels[statut] ?? statut}</Badge>
}
