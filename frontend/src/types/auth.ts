export type Role = 'user' | 'admin'

export type User = {
  id: string
  fullName: string
  email: string
  password: string
  role: Role
  phone?: string
  avatarUrl?: string
}

export type SessionUser = Omit<User, 'password'> & {
  token: string
}

export type AuthResponse = {
  user: Omit<User, 'password'>
  token: string
}

export type RegisterPayload = {
  fullName: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}
