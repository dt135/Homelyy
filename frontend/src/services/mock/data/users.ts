import type { User } from '../../../types/auth'

export const defaultUsers: User[] = [
  {
    id: 'user-1',
    fullName: 'Demo User',
    email: 'demo@homelyy.local',
    password: '123456',
    role: 'user',
    phone: '0900000001',
  },
  {
    id: 'admin-1',
    fullName: 'Admin Homelyy',
    email: 'admin@homelyy.local',
    password: 'admin123',
    role: 'admin',
    phone: '0900000002',
  },
]
