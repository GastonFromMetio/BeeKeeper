import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RucheStatusBadge } from './RucheStatusBadge'

export function RucheTable({ ruches, ruchers, onEdit, onDelete }) {
  const { t } = useTranslation()

  function getRucherName(rucherId) {
    return ruchers.find((rucher) => Number(rucher.id) === Number(rucherId))?.name ?? t('ruches.noApiary')
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('ruches.table.name')}</TableHead>
            <TableHead>{t('ruches.table.apiary')}</TableHead>
            <TableHead>{t('ruches.table.status')}</TableHead>
            <TableHead>{t('ruches.table.type')}</TableHead>
            <TableHead>{t('ruches.table.queenYear')}</TableHead>
            <TableHead className="w-28 text-right">{t('ruches.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ruches.map((ruche) => (
            <TableRow key={ruche.id}>
              <TableCell className="font-medium">{ruche.name ?? ruche.nom}</TableCell>
              <TableCell>{getRucherName(ruche.rucher_id)}</TableCell>
              <TableCell><RucheStatusBadge statut={ruche.statut} /></TableCell>
              <TableCell>{ruche.type_ruche}</TableCell>
              <TableCell>{ruche.annee_reine ?? '-'}</TableCell>
              <TableCell className="space-x-1 text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(ruche)} aria-label={t('common.edit')}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(ruche)} aria-label={t('common.delete')}>
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
