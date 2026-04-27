import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getRuchers } from '@/services/ruchersApi'

export function useRuchers() {
  const { token } = useAuth()
  const [ruchers, setRuchers] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!token) {
      setRuchers([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setRuchers(await getRuchers(token))
    } catch (apiError) {
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ruchers, isLoading, error, refetch }
}
