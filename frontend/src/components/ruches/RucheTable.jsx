import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RucheStatusBadge } from './RucheStatusBadge'

export function RucheTable({ ruches, ruchers, onEdit, onDelete }) {
  function getRucherName(rucherId) {
    return ruchers.find((rucher) => Number(rucher.id) === Number(rucherId))?.name ?? 'Inconnu'
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Rucher</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Année reine</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
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
                <Button variant="ghost" size="icon" onClick={() => onEdit(ruche)} aria-label="Modifier">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(ruche)} aria-label="Supprimer">
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
