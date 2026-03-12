import { env } from '../config/env'
import { STORAGE_KEYS } from '../constants/storageKeys'
import type { SessionUser } from '../types/auth'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
}

type ApiResponse<T> = {
  message: string
  data: T
}

function getAuthToken(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  try {
    const rawValue = localStorage.getItem(STORAGE_KEYS.authUser)
    if (!rawValue) {
      return ''
    }

    const user = JSON.parse(rawValue) as SessionUser
    return user.token || ''
  } catch {
    return ''
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken()
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = (await response.json()) as ApiResponse<T> | { message?: string }

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return (payload as ApiResponse<T>).data
}
