import { apiRequest } from '@/services/apiClient'

export function register(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function getMe(token) {
  return apiRequest('/auth/me', { token })
}

export function logout(token) {
  return apiRequest('/auth/logout', {
    method: 'DELETE',
    token,
  })
}
