import { Eye, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCoordinate, getRucherPosition } from '@/hooks/useRucherLocation'

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
          {ruchers.map((rucher) => {
            const position = getRucherPosition(rucher)

            return (
              <TableRow key={rucher.id}>
                <TableCell className="font-medium">{rucher.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p>{rucher.localisation}</p>
                    {position && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {formatCoordinate(position.lat)}, {formatCoordinate(position.lng)}
                      </p>
                    )}
                  </div>
                </TableCell>
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
