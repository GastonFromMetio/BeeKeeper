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
    <>
      <div className="grid gap-4 md:hidden">
        {ruchers.map((rucher) => {
          const position = getRucherPosition(rucher)
          const weatherReport = weatherReportsByRucherId[rucher.id] ?? null

          return (
            <article key={rucher.id} className="overflow-hidden rounded-xl border bg-card shadow-md shadow-foreground/8">
              <div className="h-2 bg-primary" />
              <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{rucher.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('rucher.capacityCount', { count: Number(rucher.nb_emplacements) })}
                  </p>
                </div>
                <Link
                  className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                  to={`/ruchers/${rucher.id}`}
                >
                  <Eye className="size-4" />
                  {t('common.view')}
                </Link>
              </div>

              <div className="mt-4 grid gap-3 text-base">
                <p className="flex items-center gap-2 rounded-xl bg-muted/60 p-3 text-muted-foreground">
                  <MapPin className="size-4" />
                  {position
                    ? `${formatCoordinate(position.lat)}, ${formatCoordinate(position.lng)}`
                    : t('rucher.coordinatesMissing')}
                </p>
                <p className="flex items-center gap-2 rounded-xl bg-primary/12 p-3 font-semibold text-primary">
                  <ThermometerSun className="size-4 text-primary" />
                  {weatherReport
                    ? formatTemperature(weatherReport.temperature, weatherReport.temperatureUnit)
                    : loadingRucherId === rucher.id
                      ? t('weather.loadingShort')
                      : t('weather.unavailable')}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onWeather?.(rucher)}
                  disabled={!position || loadingRucherId === rucher.id}
                >
                  <CloudSun className="size-4" />
                  {t('weather.column')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(rucher)}>
                  <Pencil className="size-4" />
                  {t('common.edit')}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(rucher)}>
                  <Trash2 className="size-4" />
                  {t('common.delete')}
                </Button>
              </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-md shadow-foreground/8 md:block">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('ruchers.table.name')}</TableHead>
            <TableHead>{t('ruchers.table.coordinates')}</TableHead>
            <TableHead>{t('weather.column')}</TableHead>
            <TableHead>{t('ruchers.table.capacity')}</TableHead>
            <TableHead className="w-44 text-right">{t('ruchers.table.actions')}</TableHead>
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
                      aria-label={t('common.view')}
                      title={t('common.view')}
                      >
                        <Eye className="size-4" />
                      </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rucher)}
                      aria-label={t('common.edit')}
                      title={t('common.edit')}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(rucher)}
                      aria-label={t('common.delete')}
                      title={t('common.delete')}
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
    </>
  )
}
