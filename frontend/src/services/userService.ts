import { API_ENDPOINTS } from '../constants/endpoints'
import type { SessionUser } from '../types/auth'
import { request } from './httpClient'

export type ProfileUpdatePayload = {
  fullName: string
  phone?: string
  avatarFile?: File | null
}

export type ProfileUser = Omit<SessionUser, 'token'>

export async function updateProfile(
  userId: string,
  payload: ProfileUpdatePayload,
): Promise<ProfileUser> {
  const body = new FormData()
  body.append('fullName', payload.fullName)
  body.append('phone', payload.phone ?? '')
  if (payload.avatarFile) {
    body.append('avatar', payload.avatarFile)
  }

  return request<ProfileUser>(`${API_ENDPOINTS.users.profile}/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body,
  })
}
