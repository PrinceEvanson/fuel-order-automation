const BASE = import.meta.env.VITE_API_URL || ''
const KEY = 'fuel_token'

export const tokenStore = {
  get: () => localStorage.getItem(KEY),
  set: (t) => localStorage.setItem(KEY, t),
  clear: () => localStorage.removeItem(KEY),
}

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message)
    this.status = status
    this.detail = detail
  }
}

async function request(path, { method = 'GET', body, form, raw } = {}) {
  const headers = {}
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (form) payload = form
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection.', 0)
  }
  if (res.status === 401 && token && !path.startsWith('/api/auth/login')) {
    tokenStore.clear()
    window.location.assign('/login')
  }
  if (!res.ok) {
    let detail
    try { detail = (await res.json()).detail } catch { detail = undefined }
    const msg = typeof detail === 'string' ? detail : detail?.message || `Request failed (${res.status})`
    throw new ApiError(msg, res.status, detail)
  }
  return raw ? res : res.json()
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/auth/me'),

  upload: (file) => { const f = new FormData(); f.append('file', file); return request('/api/client/documents', { method: 'POST', form: f }) },
  myDocs: () => request('/api/client/documents'),
  myDoc: (id) => request(`/api/client/documents/${id}`),
  redo: (id, error_types, comment) => request(`/api/client/documents/${id}/redo`, { method: 'POST', body: { error_types, comment } }),
  submit: (id) => request(`/api/client/documents/${id}/submit`, { method: 'POST' }),
  discard: (id) => request(`/api/client/documents/${id}`, { method: 'DELETE' }),

  queue: (bucket) => request(`/api/review/documents?bucket=${bucket}`),
  stats: () => request('/api/review/stats'),
  reviewDoc: (id) => request(`/api/review/documents/${id}`),
  audit: (id) => request(`/api/review/documents/${id}/audit`),
  edit: (id, body) => request(`/api/review/documents/${id}/fields`, { method: 'PUT', body }),
  reject: (id, reason) => request(`/api/review/documents/${id}/reject`, { method: 'POST', body: { reason } }),
  approve: (id, acknowledge_warnings) => request(`/api/review/documents/${id}/approve`, { method: 'POST', body: { acknowledge_warnings } }),

  sageStatus: () => request('/api/sage/status'),
  sageConnectUrl: () => request('/api/sage/connect-url'),

  pdfBlobUrl: async (id) => {
    const res = await request(`/api/documents/${id}/file`, { raw: true })
    return URL.createObjectURL(await res.blob())
  },
}