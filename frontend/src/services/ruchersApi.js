import { apiRequest } from './apiClient'

function toRucherPayload(payload) {
  return {
    name: payload.name,
    localisation: payload.localisation,
    latitude: Number(payload.latitude),
    longitude: Number(payload.longitude),
    description: payload.description || null,
    nb_emplacements: Number(payload.nb_emplacements),
  }
}

export function getRuchers(token) {
  return apiRequest('/ruchers', { token })
}

export function getRucher(token, id) {
  return apiRequest(`/ruchers/${id}`, { token })
}

export function createRucher(token, payload) {
  return apiRequest('/ruchers', {
    method: 'POST',
    token,
    body: toRucherPayload(payload),
  })
}

export function updateRucher(token, id, payload) {
  return apiRequest(`/ruchers/${id}`, {
    method: 'PUT',
    token,
    body: toRucherPayload(payload),
  })
}

export function deleteRucher(token, id) {
  return apiRequest(`/ruchers/${id}`, {
    method: 'DELETE',
    token,
  })
}
