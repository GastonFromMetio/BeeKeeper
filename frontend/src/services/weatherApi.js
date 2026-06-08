const DEFAULT_WEATHER_API_URL =
  import.meta.env.VITE_WEATHER_API_URL ?? 'https://api.open-meteo.com/v1/forecast'

export class WeatherApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'WeatherApiError'
  }
}

function buildWeatherUrl(latitude, longitude) {
  const url = new URL(DEFAULT_WEATHER_API_URL)

  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m',
  )
  url.searchParams.set('timezone', 'auto')

  return url
}

export async function getCurrentWeather(latitude, longitude) {
  let response

  try {
    response = await fetch(buildWeatherUrl(latitude, longitude))
  } catch {
    throw new WeatherApiError('Unable to contact the weather service.')
  }

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new WeatherApiError(data?.reason || 'Weather data is unavailable for this apiary.')
  }

  return data
}
