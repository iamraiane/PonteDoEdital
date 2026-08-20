const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type NoticeApi = {
  id: number
  title: string
  state: string | null
  state_code: string | null
  description: string | null
  link: string
  publication_date: string | null
  created_at: string
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
