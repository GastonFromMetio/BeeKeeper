import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getRucher } from '@/services/ruchersApi'

export function useRucher(id) {
  const { token } = useAuth()
  const [rucher, setRucher] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(token && id))
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!token || !id) {
      setRucher(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setRucher(await getRucher(token, id))
    } catch (apiError) {
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [id, token])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { rucher, isLoading, error, refetch }
}
