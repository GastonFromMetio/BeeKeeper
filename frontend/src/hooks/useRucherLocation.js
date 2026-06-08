export const DEFAULT_RUCHER_POSITION = {
  lat: 50.9513,
  lng: 1.8587,
}

export function parseCoordinate(value) {
  const coordinate = Number(value)

  return Number.isFinite(coordinate) ? coordinate : null
}

export function getRucherPosition(rucher) {
  const lat = parseCoordinate(rucher?.latitude)
  const lng = parseCoordinate(rucher?.longitude)

  if (lat === null || lng === null) {
    return null
  }

  return { lat, lng }
}

export function formatCoordinate(value) {
  const coordinate = parseCoordinate(value)

  return coordinate === null ? '' : coordinate.toFixed(6)
}
