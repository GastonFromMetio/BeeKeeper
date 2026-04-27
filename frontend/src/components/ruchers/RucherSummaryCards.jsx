import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RucherSummaryCards({ ruchers, ruches }) {
  const totalEmplacements = ruchers.reduce((sum, rucher) => sum + Number(rucher.nb_emplacements ?? 0), 0)
  const activeRuches = ruches.filter((ruche) => ruche.statut === 'active').length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Ruchers</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{ruchers.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ruches actives</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{activeRuches}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Emplacements</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{totalEmplacements}</CardContent>
      </Card>
    </div>
  )
}
