const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type StateApi = { id: number; name: string; code: string }
type AreaApi = { id: number; name: string }

export type NoticeApi = {
  id: number
  title: string
  description: string | null
  publication_date: string | null
  link: string
  created_at: string
  state_id: number | null
  area_id: number | null
  state?: StateApi
  area?: AreaApi
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE}/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export async function getNotices(): Promise<NoticeApi[]> {
  return authRequest<NoticeApi[]>('notices')
}
