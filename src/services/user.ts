const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
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
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export type LoginResponse = {
  message: string
  token: string
}

export type RegisterResponse = {
  message: string
}

export type UserData = {
  id: number
  name: string
  email: string
  role: string
}

export type SubscriptionData = {
  hasPremium: boolean
  plan: string
}

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
}

export async function register(name: string, email: string, password: string): Promise<RegisterResponse> {
  return request<RegisterResponse>('users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function getUserSubscription(id: number): Promise<SubscriptionData> {
  return authRequest<SubscriptionData>(`users/${id}/subscription`)
}
