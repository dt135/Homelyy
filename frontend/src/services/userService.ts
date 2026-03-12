import { env } from '../config/env'
import { API_ENDPOINTS } from '../constants/endpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'
import type { SessionUser, User } from '../types/auth'
import { readStorage, writeStorage } from '../utils/localStorage'
import { request } from './httpClient'
import { mockRequest } from './apiClient'

export type ProfileUpdatePayload = {
  fullName: string
  phone?: string
  avatarFile?: File | null
}

export type ProfileUser = Omit<SessionUser, 'token'>

function toProfileUser(user: User): ProfileUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
  }
}

export async function updateProfile(
  userId: string,
  payload: ProfileUpdatePayload,
): Promise<ProfileUser> {
  if (!env.useMockApi) {
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

  return mockRequest({
    handler: () => {
      const users = readStorage<User[]>(STORAGE_KEYS.users, [])
      const index = users.findIndex((user) => user.id === userId)
      if (index === -1) {
        throw new Error('Không tìm thấy người dùng')
      }

      const updatedUser: User = {
        ...users[index],
        fullName: payload.fullName,
        phone: payload.phone,
        avatarUrl:
          payload.avatarFile && typeof URL !== 'undefined'
            ? URL.createObjectURL(payload.avatarFile)
            : users[index].avatarUrl,
      }

      const updatedUsers = [...users]
      updatedUsers[index] = updatedUser
      writeStorage(STORAGE_KEYS.users, updatedUsers)

      return toProfileUser(updatedUser)
    },
  })
}
