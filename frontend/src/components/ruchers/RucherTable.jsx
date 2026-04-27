import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function RucherTable({ ruchers, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Emplacements</TableHead>
            <TableHead className="w-36 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ruchers.map((rucher) => (
            <TableRow key={rucher.id}>
              <TableCell className="font-medium">{rucher.name}</TableCell>
              <TableCell>{rucher.localisation}</TableCell>
              <TableCell>{rucher.nb_emplacements}</TableCell>
              <TableCell className="space-x-1 text-right">
                <Link className={buttonVariants({ variant: 'ghost', size: 'icon' })} to={`/ruchers/${rucher.id}`} aria-label="Voir">
                  <Eye className="size-4" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => onEdit(rucher)} aria-label="Modifier">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(rucher)} aria-label="Supprimer">
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
