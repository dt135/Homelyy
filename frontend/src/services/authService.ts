import { env } from '../config/env'
import { API_ENDPOINTS } from '../constants/endpoints'
import { STORAGE_KEYS } from '../constants/storageKeys'
import type { AuthResponse, LoginPayload, RegisterPayload, SessionUser, User } from '../types/auth'
import { readStorage, writeStorage } from '../utils/localStorage'
import { request } from './httpClient'
import { mockRequest } from './apiClient'
import { defaultUsers } from './mock/data/users'

function getUsers(): User[] {
  const users = readStorage<User[]>(STORAGE_KEYS.users, [])
  if (users.length > 0) {
    return users
  }
  writeStorage(STORAGE_KEYS.users, defaultUsers)
  return defaultUsers
}

function toSessionUser(user: User, token: string): SessionUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    token,
  }
}

function mapAuthResponse(response: AuthResponse): SessionUser {
  return {
    ...response.user,
    token: response.token,
  }
}

export async function login(payload: LoginPayload): Promise<SessionUser> {
  if (!env.useMockApi) {
    const response = await request<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: payload,
    })
    return mapAuthResponse(response)
  }

  return mockRequest({
    handler: () => {
      const users = getUsers()
      const found = users.find(
        (user) =>
          user.email.toLowerCase() === payload.email.toLowerCase() &&
          user.password === payload.password,
      )

      if (!found) {
        throw new Error('Email hoặc mật khẩu chưa đúng')
      }

      return toSessionUser(found, `mock-token-${found.id}`)
    },
  })
}

export async function register(payload: RegisterPayload): Promise<SessionUser> {
  if (!env.useMockApi) {
    const response = await request<AuthResponse>(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: payload,
    })
    return mapAuthResponse(response)
  }

  return mockRequest({
    handler: () => {
      const users = getUsers()
      const emailExists = users.some(
        (user) => user.email.toLowerCase() === payload.email.toLowerCase(),
      )

      if (emailExists) {
        throw new Error('Email đã tồn tại')
      }

      const createdUser: User = {
        id: `user-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        role: 'user',
        avatarUrl: '',
      }

      const updatedUsers = [...users, createdUser]
      writeStorage(STORAGE_KEYS.users, updatedUsers)
      return toSessionUser(createdUser, `mock-token-${createdUser.id}`)
    },
  })
}
