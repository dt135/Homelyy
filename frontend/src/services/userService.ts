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
}

export type ProfileUser = Omit<SessionUser, 'token'>

function toProfileUser(user: User): ProfileUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }
}

export async function updateProfile(
  userId: string,
  payload: ProfileUpdatePayload,
): Promise<ProfileUser> {
  if (!env.useMockApi) {
    return request<ProfileUser>(`${API_ENDPOINTS.users.profile}/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: payload,
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
      }

      const updatedUsers = [...users]
      updatedUsers[index] = updatedUser
      writeStorage(STORAGE_KEYS.users, updatedUsers)

      return toProfileUser(updatedUser)
    },
  })
}
