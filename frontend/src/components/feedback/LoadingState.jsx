import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState({ label }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10">
      <section
        aria-live="polite"
        aria-busy="true"
        className="w-full rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur-sm"
      >
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-10 w-2/3" />
          {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
        </div>
      </section>
    </main>
  )
}
