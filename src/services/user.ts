const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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

export type SubscriptionData = {
  hasPremium: boolean
  plan: string
}

export async function getUserSubscription(id: number): Promise<SubscriptionData> {
  return authRequest<SubscriptionData>(`users/${id}/subscription`)
}
