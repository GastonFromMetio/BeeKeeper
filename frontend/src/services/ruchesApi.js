import { apiRequest } from './apiClient'

function toRuchePayload(payload) {
  return {
    rucher_id: Number(payload.rucher_id),
    name: payload.name,
    statut: payload.statut,
    type_ruche: payload.type_ruche,
    annee_reine: payload.annee_reine ? Number(payload.annee_reine) : null,
    notes: payload.notes || null,
  }
}

function normalizeRuche(ruche) {
  return {
    ...ruche,
    name: ruche.name ?? ruche.nom ?? '',
  }
}

export async function getRuches(token) {
  const ruches = await apiRequest('/ruches', { token })
  return ruches.map(normalizeRuche)
}

export async function getRuche(token, id) {
  const ruche = await apiRequest(`/ruches/${id}`, { token })
  return normalizeRuche(ruche)
}

export function createRuche(token, payload) {
  return apiRequest('/ruches', {
    method: 'POST',
    token,
    body: toRuchePayload(payload),
  })
}

export function updateRuche(token, id, payload) {
  return apiRequest(`/ruches/${id}`, {
    method: 'PUT',
    token,
    body: toRuchePayload(payload),
  })
}

export function deleteRuche(token, id) {
  return apiRequest(`/ruches/${id}`, {
    method: 'DELETE',
    token,
  })
}
