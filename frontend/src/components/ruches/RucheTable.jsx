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
    <>
      <div className="grid gap-4 md:hidden">
        {ruches.map((ruche) => (
          <article key={ruche.id} className="overflow-hidden rounded-xl border bg-card shadow-md shadow-foreground/8">
            <div className="h-2 bg-secondary" />
            <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{ruche.name ?? ruche.nom}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{getRucherName(ruche.rucher_id)}</p>
              </div>
              <RucheStatusBadge statut={ruche.statut} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-muted-foreground">{t('ruches.table.type')}</p>
                <p className="mt-1 font-semibold">{ruche.type_ruche}</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-muted-foreground">{t('ruches.table.queenYear')}</p>
                <p className="mt-1 font-semibold">{ruche.annee_reine ?? '-'}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(ruche)} aria-label={t('common.edit')}>
                <Pencil className="size-4" />
                {t('common.edit')}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(ruche)} aria-label={t('common.delete')}>
                <Trash2 className="size-4" />
                {t('common.delete')}
              </Button>
            </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-md shadow-foreground/8 md:block">
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
    </>
  )
}
