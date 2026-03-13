import { API_ENDPOINTS } from '../constants/endpoints'
import type { AuthResponse, LoginPayload, RegisterPayload, SessionUser } from '../types/auth'
import { request } from './httpClient'

function mapAuthResponse(response: AuthResponse): SessionUser {
  return {
    ...response.user,
    token: response.token,
  }
}

export async function login(payload: LoginPayload): Promise<SessionUser> {
  const response = await request<AuthResponse>(API_ENDPOINTS.auth.login, {
    method: 'POST',
    body: payload,
  })

  return mapAuthResponse(response)
}

export async function register(payload: RegisterPayload): Promise<SessionUser> {
  const response = await request<AuthResponse>(API_ENDPOINTS.auth.register, {
    method: 'POST',
    body: payload,
  })

  return mapAuthResponse(response)
}
