import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { getRucherPosition } from '@/hooks/useRucherLocation'
import { fetchRucherWeather, normalizeWeatherReport, WeatherApiError } from '@/services/weatherApi'

const WeatherContext = createContext(null)

export function WeatherProvider({ children }) {
  const { token } = useAuth()
  const [weatherByRucherId, setWeatherByRucherId] = useState({})
  const [pendingRucherId, setPendingRucherId] = useState(null)
  const weatherByRucherIdRef = useRef(weatherByRucherId)
  const pendingRucherIdRef = useRef(pendingRucherId)

  useEffect(() => {
    weatherByRucherIdRef.current = weatherByRucherId
  }, [weatherByRucherId])

  useEffect(() => {
    pendingRucherIdRef.current = pendingRucherId
  }, [pendingRucherId])

  useEffect(() => {
    setWeatherByRucherId({})
    setPendingRucherId(null)
  }, [token])

  const getWeatherReport = useCallback((rucherId) => {
    return weatherByRucherIdRef.current[rucherId] ?? null
  }, [])

  const mergeReports = useCallback((reportsToMerge) => {
    const normalizedReports = reportsToMerge
      .map((report) => normalizeWeatherReport(report))
      .filter((report) => report?.rucherId)

    if (normalizedReports.length === 0) {
      return
    }

    setWeatherByRucherId((currentReports) => {
      const nextReports = { ...currentReports }

      for (const report of normalizedReports) {
        nextReports[report.rucherId] = report
      }

      const orderedReports = Object.values(nextReports)
        .sort((left, right) => new Date(right.fetchedAt) - new Date(left.fetchedAt))

      return Object.fromEntries(orderedReports.map((item) => [item.rucherId, item]))
    })
  }, [])

  const primeWeatherReportsFromRuchers = useCallback((ruchers = []) => {
    mergeReports(
      ruchers
        .map((rucher) => normalizeWeatherReport(rucher.latest_weather_report, rucher))
        .filter(Boolean),
    )
  }, [mergeReports])

  const fetchWeatherForRucher = useCallback(async (rucher, options = {}) => {
    const position = getRucherPosition(rucher)
    const { force = false } = options

    if (!position) {
      throw new WeatherApiError('Missing apiary coordinates.', 'weather.missingCoordinates')
    }

    const cachedReport = weatherByRucherIdRef.current[rucher.id] ?? null
    if (cachedReport && !force) {
      return cachedReport
    }

    if (pendingRucherIdRef.current === rucher.id) {
      return cachedReport
    }

    setPendingRucherId(rucher.id)
    pendingRucherIdRef.current = rucher.id

    try {
      const report = await fetchRucherWeather(token, rucher.id)
      mergeReports([report])
      return report
    } finally {
      setPendingRucherId(null)
      pendingRucherIdRef.current = null
    }
  }, [mergeReports, token])

  const reports = useMemo(() => (
    Object.values(weatherByRucherId)
      .sort((left, right) => new Date(right.fetchedAt) - new Date(left.fetchedAt))
  ), [weatherByRucherId])

  const value = useMemo(() => ({
    weatherByRucherId,
    reports,
    latestReport: reports[0] ?? null,
    pendingRucherId,
    isFetching: pendingRucherId !== null,
    getWeatherReport,
    fetchWeatherForRucher,
    primeWeatherReportsFromRuchers,
  }), [
    fetchWeatherForRucher,
    getWeatherReport,
    pendingRucherId,
    primeWeatherReportsFromRuchers,
    reports,
    weatherByRucherId,
  ])

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const context = useContext(WeatherContext)

  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }

  return context
}
