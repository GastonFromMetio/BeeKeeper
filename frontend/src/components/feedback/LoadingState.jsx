import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function PageHeaderSkeleton({ withAction = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      {withAction ? <Skeleton className="h-10 w-32" /> : null}
    </div>
  )
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <Card key={item}>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton({ columns = 4, rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Skeleton className={columnIndex === columns - 1 ? 'ml-auto h-8 w-24' : 'h-4 w-28'} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-36" />
      <section className="space-y-3 rounded-lg border p-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-28" />
      </section>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-10 w-32" />
      </div>
      <TableSkeleton columns={6} rows={4} />
    </div>
  )
}

function CenteredSkeleton({ label }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-lg border border-border/70 bg-card p-6 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-14 w-full" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        {label ? <p className="mt-4 text-sm text-muted-foreground">{label}</p> : null}
      </div>
    </main>
  )
}

export function LoadingState({ label, variant = 'centered', columns = 4 }) {
  if (variant === 'dashboard') {
    return (
      <div aria-live="polite" aria-busy="true" className="space-y-6">
        <PageHeaderSkeleton />
        <SummaryCardsSkeleton />
        {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div aria-live="polite" aria-busy="true" className="space-y-6">
        <PageHeaderSkeleton withAction />
        <TableSkeleton columns={columns} />
        {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div aria-live="polite" aria-busy="true">
        <DetailSkeleton />
        {label ? <p className="mt-4 text-sm text-muted-foreground">{label}</p> : null}
      </div>
    )
  }

  return <CenteredSkeleton label={label} />
}
