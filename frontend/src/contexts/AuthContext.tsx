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
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateProfile: (payload: { fullName: string; phone?: string; avatarFile?: File | null }) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    const initialUser = readStorage<SessionUser | null>(STORAGE_KEYS.authUser, null)
    if (initialUser && initialUser.token) {
      setUser(initialUser)
      return
    }
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
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
        const nextUser: SessionUser = {
          ...updatedUser,
          token: user.token,
        }
        setUser(nextUser)
        writeStorage(STORAGE_KEYS.authUser, nextUser)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
