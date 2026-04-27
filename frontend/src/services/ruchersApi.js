import { apiRequest } from './apiClient'

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
    body: payload,
  })
}

export function updateRucher(token, id, payload) {
  return apiRequest(`/ruchers/${id}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function deleteRucher(token, id) {
  return apiRequest(`/ruchers/${id}`, {
    method: 'DELETE',
    token,
  })
}
