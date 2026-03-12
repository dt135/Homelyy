import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../services/apiClient'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (fullName.trim().length < 3) {
      setErrorMessage('Họ và tên cần ít nhất 3 ký tự')
      return
    }
    if (!email.includes('@')) {
      setErrorMessage('Định dạng email chưa hợp lệ')
      return
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần ít nhất 6 ký tự')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      await register({ fullName: fullName.trim(), email: email.trim(), password })
      navigate('/profile')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Xác thực</p>
      <h1 className="page-title">Đăng ký tài khoản</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>Họ và tên</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nguyễn Văn A"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="field">
          <span>Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tạo mật khẩu"
          />
        </label>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <button type="submit" className="primary-btn">
          {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </section>
  )
}

export default RegisterPage
