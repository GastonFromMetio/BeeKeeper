export const DEFAULT_RUCHER_POSITION = {
  lat: 46.603354,
  lng: 1.888334,
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
