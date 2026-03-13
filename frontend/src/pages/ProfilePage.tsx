import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { normalizePhone, normalizeWhitespace, validateFullName, validatePhone } from '../utils/validators'

function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const avatarPreview = avatarPreviewUrl || user?.avatarUrl || ''

  useEffect(() => {
    if (!avatarFile || typeof URL === 'undefined') {
      setAvatarPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(avatarFile)
    setAvatarPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [avatarFile])

  useEffect(() => {
    setFullName(user?.fullName ?? '')
    setPhone(user?.phone ?? '')
    setAvatarFile(null)
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fullNameError = validateFullName(fullName)
    if (fullNameError) {
      setStatusMessage(fullNameError)
      return
    }

    const phoneError = validatePhone(phone)
    if (phoneError) {
      setStatusMessage(phoneError)
      return
    }

    try {
      await updateProfile({
        fullName: normalizeWhitespace(fullName),
        phone: normalizePhone(phone),
        avatarFile,
      })
      setStatusMessage('Cập nhật hồ sơ thành công')
      setAvatarFile(null)
    } catch {
      setStatusMessage('Có lỗi khi cập nhật hồ sơ')
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Hồ sơ người dùng</p>
      <h1 className="page-title">Tài khoản của bạn</h1>

      <div className="placeholder-grid">
        <form className="placeholder-card" onSubmit={handleSubmit}>
          <h2>Thông tin cá nhân</h2>
          <p className="catalog-muted">Email: {user?.email}</p>

          <div className="profile-avatar-wrap">
            {avatarPreview ? (
              <img src={avatarPreview} alt={user?.fullName || 'Avatar'} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-fallback">{user?.fullName?.slice(0, 1).toUpperCase() || 'U'}</div>
            )}
          </div>

          <label className="field">
            <span>Ảnh đại diện</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <label className="field">
            <span>Họ và tên</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </label>
          <label className="field">
            <span>Số điện thoại</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <button type="submit" className="ghost-btn">
            Cập nhật hồ sơ
          </button>
          {statusMessage ? <p className="catalog-muted">{statusMessage}</p> : null}
        </form>
      </div>
    </section>
  )
}

export default ProfilePage
