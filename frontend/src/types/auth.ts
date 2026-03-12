export type Role = 'user' | 'admin'

export type User = {
  id: string
  fullName: string
  email: string
  password: string
  role: Role
  phone?: string
}

export type SessionUser = Omit<User, 'password'>

export type RegisterPayload = {
  fullName: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}
