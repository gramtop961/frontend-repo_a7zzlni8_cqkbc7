const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => localStorage.setItem('token', t)
export const clearToken = () => localStorage.removeItem('token')

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let msg = 'Request failed'
    try { const j = await res.json(); msg = j.detail || JSON.stringify(j) } catch {}
    throw new Error(msg)
  }
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export { BASE_URL }
