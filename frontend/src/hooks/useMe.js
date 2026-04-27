import { useCallback, useEffect, useState } from 'react'

import { getMe } from '@/services/authApi'

export function useMe(token, options = {}) {
  const { enabled = true } = options
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(token && enabled))

  const refetch = useCallback(async () => {
    if (!token || !enabled) {
      setUser(null)
      setError(null)
      setIsLoading(false)
      return null
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await getMe(token)
      setUser(response)
      return response
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setIsLoading(false)
    }
  }, [enabled, token])

  useEffect(() => {
    refetch().catch(() => {})
  }, [refetch])

  return {
    user,
    error,
    isLoading,
    refetch,
  }
}
