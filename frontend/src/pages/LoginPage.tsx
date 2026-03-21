import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../services/apiClient'
import { normalizeEmail, validateEmail } from '../utils/validators'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('demo@homelyy.local')
  const [password, setPassword] = useState('demo1234')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const emailError = validateEmail(email)
    if (emailError) {
      setErrorMessage(emailError)
      return
    }

    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const loggedInUser = await login({ email: normalizeEmail(email), password })
      const nextPath =
        (location.state as { from?: string } | null)?.from ??
        (loggedInUser.role === 'admin' ? '/admin' : '/')
      navigate(nextPath)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-stack reveal-up">
      <p className="eyebrow">Xác thực</p>
      <h1 className="page-title">Đăng nhập</h1>

      <form className="form-card" onSubmit={handleSubmit}>
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
            placeholder="Nhập mật khẩu"
          />
        </label>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
        <p className="catalog-muted">User demo: demo@homelyy.local / demo1234</p>
        <p className="catalog-muted">Admin demo: admin@homelyy.local / admin123</p>
      </form>
    </section>
  )
}

export default LoginPage
