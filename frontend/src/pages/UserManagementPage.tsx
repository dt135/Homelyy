import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  type AdminUser,
  updateAdminUser,
} from '../services/adminService'
import { getErrorMessage } from '../services/apiClient'
import {
  normalizeEmail,
  normalizePhone,
  normalizeWhitespace,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '../utils/validators'
import { formatDate } from '../utils/formatters'

type UserForm = {
  id: string
  fullName: string
  email: string
  phone: string
  role: 'user' | 'admin'
  password: string
}

const initialForm: UserForm = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'user',
  password: '',
}

function mapUserToForm(user: AdminUser): UserForm {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role,
    password: '',
  }
}

function formatCreatedAt(value?: string): string {
  if (!value) {
    return '-'
  }
  return formatDate(value)
}

function UserManagementPage() {
  const { user: authUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [keyword, setKeyword] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(initialForm)
  const formRef = useRef<HTMLFormElement | null>(null)

  async function loadUsers() {
    try {
      setIsLoading(true)
      setErrorMessage('')
      const payload = await fetchAdminUsers()
      setUsers(payload)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    if (!normalizedKeyword) {
      return users
    }

    return users.filter((item) => {
      const searchable = `${item.id} ${item.fullName} ${item.email} ${item.phone ?? ''}`.toLowerCase()
      return searchable.includes(normalizedKeyword)
    })
  }, [users, keyword])

  function updateField<K extends keyof UserForm>(key: K, value: UserForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm(initialForm)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fullNameError = validateFullName(form.fullName)
    if (fullNameError) {
      setErrorMessage(fullNameError)
      return
    }

    const emailError = validateEmail(form.email)
    if (emailError) {
      setErrorMessage(emailError)
      return
    }

    const phoneError = validatePhone(form.phone)
    if (phoneError) {
      setErrorMessage(phoneError)
      return
    }

    const normalizedPassword = form.password.trim()
    if (!editingId || normalizedPassword) {
      const passwordError = validatePassword(normalizedPassword)
      if (passwordError) {
        setErrorMessage(passwordError)
        return
      }
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const normalizedPayload = {
        fullName: normalizeWhitespace(form.fullName),
        email: normalizeEmail(form.email),
        phone: normalizePhone(form.phone),
        role: form.role,
      }

      if (editingId) {
        await updateAdminUser(editingId, {
          ...normalizedPayload,
          ...(normalizedPassword ? { password: normalizedPassword } : {}),
        })
      } else {
        await createAdminUser({
          id: form.id.trim() || undefined,
          ...normalizedPayload,
          password: normalizedPassword,
        })
      }

      await loadUsers()
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id)
    setForm(mapUserToForm(user))
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  async function handleDelete(targetUserId: string) {
    const shouldDelete = window.confirm('Bạn có chắc muốn xóa người dùng này?')
    if (!shouldDelete) {
      return
    }

    try {
      setErrorMessage('')
      await deleteAdminUser(targetUserId)
      await loadUsers()

      if (editingId === targetUserId) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Quản trị người dùng</p>
      <h1 className="page-title">Quản lý người dùng</h1>

      <form ref={formRef} className="placeholder-card admin-edit-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Cập nhật người dùng' : 'Tạo tài khoản người dùng'}</h2>

        <div className="placeholder-grid">
          {!editingId ? (
            <label className="field">
              <span>ID (tùy chọn)</span>
              <input value={form.id} onChange={(event) => updateField('id', event.target.value)} />
            </label>
          ) : (
            <label className="field">
              <span>ID</span>
              <input value={form.id} disabled />
            </label>
          )}

          <label className="field">
            <span>Họ và tên</span>
            <input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>

          <label className="field">
            <span>Số điện thoại</span>
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          </label>

          <label className="field">
            <span>Vai trò</span>
            <select value={form.role} onChange={(event) => updateField('role', event.target.value as 'user' | 'admin')}>
              <option value="user">Khách hàng</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="field">
            <span>{editingId ? 'Mật khẩu mới (tùy chọn)' : 'Mật khẩu'}</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
          </label>
        </div>

        <div className="button-row">
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : editingId ? 'Lưu cập nhật' : 'Tạo người dùng'}
          </button>
          {editingId ? (
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Hủy chỉnh sửa
            </button>
          ) : null}
        </div>
      </form>

      <label className="catalog-search">
        <span>Tìm người dùng</span>
        <input
          type="search"
          placeholder="Nhập tên, email, số điện thoại..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </label>

      {errorMessage ? <div className="state-card">{errorMessage}</div> : null}
      {isLoading ? <div className="state-card">Đang tải danh sách người dùng...</div> : null}

      {!isLoading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => {
                const isCurrentUser = authUser?.id === item.id

                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.fullName}</td>
                    <td>{item.email}</td>
                    <td>{item.phone || '-'}</td>
                    <td>{item.role === 'admin' ? 'Admin' : 'Khách hàng'}</td>
                    <td>{formatCreatedAt(item.createdAt)}</td>
                    <td>
                      <div className="button-row">
                        <button type="button" className="ghost-btn" onClick={() => startEdit(item)}>
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="ghost-btn"
                          onClick={() => handleDelete(item.id)}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? 'Không thể tự xóa tài khoản đang đăng nhập' : ''}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default UserManagementPage
