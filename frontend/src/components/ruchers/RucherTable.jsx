import { CloudSun, Eye, MapPin, Pencil, ThermometerSun, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCoordinate, getRucherPosition } from '@/hooks/useRucherLocation'
import { useTranslation } from 'react-i18next'

function formatTemperature(value, unit = '°C') {
  if (!Number.isFinite(Number(value))) {
    return '—'
  }

  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  })

  return `${formatter.format(Number(value))} ${unit}`
}

export function RucherTable({
  ruchers,
  onEdit,
  onDelete,
  onWeather,
  weatherReportsByRucherId = {},
  loadingRucherId = null,
}) {
  const { t } = useTranslation()

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Coordonnées</TableHead>
            <TableHead>{t('weather.column')}</TableHead>
            <TableHead>Emplacements</TableHead>
            <TableHead className="w-44 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ruchers.map((rucher) => {
            const position = getRucherPosition(rucher)
            const weatherReport = weatherReportsByRucherId[rucher.id] ?? null

            return (
              <TableRow key={rucher.id}>
                <TableCell className="font-medium">{rucher.name}</TableCell>
                <TableCell>
                  {position ? (
                    <p className="flex items-center gap-1 text-sm">
                      <MapPin className="size-3.5" />
                      {formatCoordinate(position.lat)}, {formatCoordinate(position.lng)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t('rucher.coordinatesMissing')}</p>
                  )}
                </TableCell>
                <TableCell>
                  {weatherReport ? (
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 font-medium">
                        <ThermometerSun className="size-3.5 text-primary" />
                        {formatTemperature(weatherReport.temperature, weatherReport.temperatureUnit)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('weather.feelsLike', {
                          value: formatTemperature(
                            weatherReport.apparentTemperature,
                            weatherReport.apparentTemperatureUnit,
                          ),
                        })}
                      </p>
                    </div>
                  ) : loadingRucherId === rucher.id ? (
                    <p className="text-sm text-muted-foreground">{t('weather.loadingShort')}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t('weather.unavailable')}</p>
                  )}
                </TableCell>
                <TableCell>{rucher.nb_emplacements}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onWeather?.(rucher)}
                      disabled={!position || loadingRucherId === rucher.id}
                      aria-label={t('weather.buttonLabel')}
                      title={position ? t('weather.buttonLabel') : t('weather.missingCoordinates')}
                    >
                      <CloudSun className="size-4" />
                    </Button>
                    <Link
                      className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                      to={`/ruchers/${rucher.id}`}
                      aria-label="Voir"
                      title="Voir"
                      >
                        <Eye className="size-4" />
                      </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rucher)}
                      aria-label="Modifier"
                      title="Modifier"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(rucher)}
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
