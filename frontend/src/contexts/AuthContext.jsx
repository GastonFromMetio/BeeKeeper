/* eslint react-refresh/only-export-components: off */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { ApiError } from '@/services/apiClient'
import * as authApi from '@/services/authApi'

const TOKEN_KEY = 'beekeeper.auth.token'
const AuthContext = createContext(null)

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TOKEN_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()))

  const persistToken = useCallback((nextToken) => {
    setToken(nextToken)

    if (typeof window === 'undefined') {
      return
    }

    if (nextToken) {
      window.localStorage.setItem(TOKEN_KEY, nextToken)
      return
    }

    window.localStorage.removeItem(TOKEN_KEY)
  }, [])

  const clearSession = useCallback(() => {
    persistToken(null)
    setUser(null)
  }, [persistToken])

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return null
    }

    try {
      setIsLoading(true)
      const nextUser = await authApi.getMe(token)
      setUser(nextUser)
      return nextUser
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession()
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [clearSession, token])

  useEffect(() => {
    let isActive = true

    async function restoreSession() {
      if (!token) {
        setIsLoading(false)
        setUser(null)
        return
      }

      try {
        const nextUser = await authApi.getMe(token)
        if (isActive) {
          setUser(nextUser)
        }
      } catch {
        if (isActive) {
          clearSession()
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isActive = false
    }
  }, [clearSession, token])

  const login = useCallback(
    async (payload) => {
      const response = await authApi.login(payload)
      persistToken(response.token)
      setUser(response.user)
      setIsLoading(false)
      return response
    },
    [persistToken],
  )

  const register = useCallback(
    async (payload) => {
      const response = await authApi.register(payload)
      persistToken(response.token)
      setUser(response.user)
      setIsLoading(false)
      return response
    },
    [persistToken],
  )

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout(token)
      }
    } catch {
      // On purge quand meme la session locale si le token backend est deja invalide.
    } finally {
      clearSession()
      setIsLoading(false)
    }
  }, [clearSession, token])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshMe,
    }),
    [isLoading, login, logout, refreshMe, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
