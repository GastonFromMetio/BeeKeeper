import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { withMinimumLoadingDelay } from '@/lib/loadingDelay'
import { getRuches } from '@/services/ruchesApi'

export function useRuches(filters = {}) {
  const { token } = useAuth()
  const [allRuches, setAllRuches] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!token) {
      setAllRuches([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setAllRuches(await withMinimumLoadingDelay(() => getRuches(token)))
    } catch (apiError) {
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    refetch()
  }, [refetch])

  const ruches = useMemo(() => allRuches.filter((ruche) => {
    if (filters.rucherId && String(ruche.rucher_id) !== String(filters.rucherId)) return false
    if (filters.statut && ruche.statut !== filters.statut) return false

    return true
  }), [allRuches, filters.rucherId, filters.statut])

  return { ruches, isLoading, error, refetch }
}
