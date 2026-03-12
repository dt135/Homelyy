import { env } from '../config/env'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
}

type ApiResponse<T> = {
  message: string
  data: T
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = (await response.json()) as ApiResponse<T> | { message?: string }

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return (payload as ApiResponse<T>).data
}
