import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { getRucherPosition } from '@/hooks/useRucherLocation'
import { getCurrentWeather, WeatherApiError } from '@/services/weatherApi'

const WeatherContext = createContext(null)

function buildWeatherReport(rucher, position, data) {
  const current = data?.current ?? {}
  const currentUnits = data?.current_units ?? {}

  return {
    rucherId: rucher.id,
    rucherName: rucher.name,
    latitude: position.lat,
    longitude: position.lng,
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature ?? null,
    windSpeed: current.wind_speed_10m ?? null,
    humidity: current.relative_humidity_2m ?? null,
    temperatureUnit: currentUnits.temperature_2m ?? '°C',
    apparentTemperatureUnit: currentUnits.apparent_temperature ?? currentUnits.temperature_2m ?? '°C',
    windSpeedUnit: currentUnits.wind_speed_10m ?? 'km/h',
    humidityUnit: currentUnits.relative_humidity_2m ?? '%',
    fetchedAt: new Date().toISOString(),
  }
}

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

  const fetchWeatherForRucher = useCallback(async (rucher) => {
    const position = getRucherPosition(rucher)

    if (!position) {
      throw new WeatherApiError('Les coordonnees du rucher sont manquantes.')
    }

    const cachedReport = weatherByRucherIdRef.current[rucher.id] ?? null
    if (cachedReport) {
      return cachedReport
    }

    if (pendingRucherIdRef.current === rucher.id) {
      return cachedReport
    }

    setPendingRucherId(rucher.id)
    pendingRucherIdRef.current = rucher.id

    try {
      const data = await getCurrentWeather(position.lat, position.lng)
      const report = buildWeatherReport(rucher, position, data)

      setWeatherByRucherId((currentReports) => {
        const nextReports = {
          ...currentReports,
          [report.rucherId]: report,
        }

        const orderedReports = Object.values(nextReports)
          .sort((left, right) => new Date(right.fetchedAt) - new Date(left.fetchedAt))

        return Object.fromEntries(orderedReports.map((item) => [item.rucherId, item]))
      })

      return report
    } finally {
      setPendingRucherId(null)
      pendingRucherIdRef.current = null
    }
  }, [])

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
  }), [fetchWeatherForRucher, getWeatherReport, pendingRucherId, reports, weatherByRucherId])

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const context = useContext(WeatherContext)

  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }

  return context
}
