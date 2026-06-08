import { lazy, Suspense } from 'react'

import { cn } from '@/lib/utils'

const RucherLocationMapLeaflet = lazy(() => import('@/components/map/RucherLocationMapLeaflet').then((module) => ({
  default: module.RucherLocationMapLeaflet,
})))

export function RucherLocationMap({ className, ...props }) {
  return (
    <Suspense
      fallback={(
        <div className={cn('flex min-h-72 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground', className)}>
          Chargement de la carte...
        </div>
      )}
    >
      <RucherLocationMapLeaflet className={className} {...props} />
    </Suspense>
  )
}
