import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { login as loginService, register as registerService } from '../services/authService'
import { updateProfile as updateProfileService } from '../services/userService'
import type { LoginPayload, RegisterPayload, SessionUser } from '../types/auth'
import { readStorage, writeStorage } from '../utils/localStorage'

type AuthContextValue = {
  user: SessionUser | null
  isAuthenticated: boolean
  isAuthReady: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateProfile: (payload: { fullName: string; phone?: string; avatarFile?: File | null }) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

function withAvatarCacheBust(avatarUrl: string | undefined, cacheKey: number): string | undefined {
  if (!avatarUrl) {
    return avatarUrl
  }

  return `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}v=${cacheKey}`
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const initialUser = readStorage<SessionUser | null>(STORAGE_KEYS.authUser, null)
    if (initialUser && initialUser.token) {
      setUser(initialUser)
    } else {
      setUser(null)
    }
    setIsAuthReady(true)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      isAuthReady,
      login: async (payload) => {
        const loggedInUser = await loginService(payload)
        setUser(loggedInUser)
        writeStorage(STORAGE_KEYS.authUser, loggedInUser)
      },
      register: async (payload) => {
        const createdUser = await registerService(payload)
        setUser(createdUser)
        writeStorage(STORAGE_KEYS.authUser, createdUser)
      },
      logout: () => {
        setUser(null)
        writeStorage(STORAGE_KEYS.authUser, null)
      },
      updateProfile: async (payload) => {
        if (!user) {
          throw new Error('Bạn cần đăng nhập trước')
        }
        const updatedUser = await updateProfileService(user.id, payload)
        const cacheKey = payload.avatarFile ? Date.now() : null
        const nextUser: SessionUser = {
          ...updatedUser,
          avatarUrl: cacheKey ? withAvatarCacheBust(updatedUser.avatarUrl, cacheKey) : updatedUser.avatarUrl,
          token: user.token,
        }
        setUser(nextUser)
        writeStorage(STORAGE_KEYS.authUser, nextUser)
      },
    }),
    [isAuthReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
