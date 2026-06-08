import { apiRequest } from '@/services/apiClient'

export class WeatherApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'WeatherApiError'
  }
}

export function normalizeWeatherReport(report, fallbackRucher = null) {
  if (!report) {
    return null
  }

  return {
    id: report.id,
    rucherId: report.rucherId ?? report.rucher_id ?? fallbackRucher?.id,
    rucherName: report.rucherName ?? report.rucher_name ?? fallbackRucher?.name,
    latitude: report.latitude,
    longitude: report.longitude,
    temperature: report.temperature,
    apparentTemperature: report.apparentTemperature ?? report.apparent_temperature,
    windSpeed: report.windSpeed ?? report.wind_speed,
    humidity: report.humidity,
    temperatureUnit: report.temperatureUnit ?? report.temperature_unit ?? '°C',
    apparentTemperatureUnit:
      report.apparentTemperatureUnit ?? report.apparent_temperature_unit ?? report.temperature_unit ?? '°C',
    windSpeedUnit: report.windSpeedUnit ?? report.wind_speed_unit ?? 'km/h',
    humidityUnit: report.humidityUnit ?? report.humidity_unit ?? '%',
    source: report.source ?? 'Open-Meteo',
    fetchedAt: report.fetchedAt ?? report.fetched_at ?? fallbackRucher?.last_weather_checked_at,
  }
}

export async function fetchRucherWeather(token, rucherId) {
  const report = await apiRequest(`/ruchers/${rucherId}/weather`, {
    method: 'POST',
    token,
  })

  return normalizeWeatherReport(report)
}

export async function getRucherWeatherHistory(token, rucherId) {
  const reports = await apiRequest(`/ruchers/${rucherId}/weather`, { token })

  return reports.map((report) => normalizeWeatherReport(report))
}
