import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { withMinimumLoadingDelay } from '@/lib/loadingDelay'
import { getRuche } from '@/services/ruchesApi'

export function useRuche(id) {
  const { token } = useAuth()
  const [ruche, setRuche] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(token && id))
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!token || !id) {
      setRuche(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setRuche(await withMinimumLoadingDelay(() => getRuche(token, id)))
    } catch (apiError) {
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [id, token])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ruche, isLoading, error, refetch }
}
