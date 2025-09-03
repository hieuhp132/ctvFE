import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaFacebook, FaLinkedin } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import { mockUsers } from "../../mock/mockUsers"
import "./Login.css"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = e.target.username.value.trim()
    const password = e.target.password.value.trim()

    let newErrors = { username: "", password: "" }
    let hasError = false

    if (!username) {
      newErrors.username = "Vui lòng nhập tài khoản"
      hasError = true
    }
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
      hasError = true
    }

    setErrors(newErrors)

    if (hasError) {
      setShake(true)
      setTimeout(() => setShake(false), 550)
      return
    }

    setLoading(true)

    // fake API call với mockUsers
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === username && u.password === password)
      if (user) {
        login(user) // lưu user vào context và điều hướng trong AuthContext
      } else {
        setErrors({ username: "Sai username hoặc mật khẩu", password: "" })
        setShake(true)
        setTimeout(() => setShake(false), 550)
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container">
      <div className={`shake-wrapper ${shake ? "is-shaking" : ""}`}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="title">
            Chào mừng quay trở lại!
            <div style={{ fontSize: "15px", marginTop: "10px", fontWeight: "bold" }}>
              Đăng nhập để tiếp tục
            </div>
          </div>

          {/* Username */}
          <div className="input-group">
            <label className="label" htmlFor="username">Tài khoản</label>
            <div className="input-wrapper">
              <FaUser className="icon" />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập username"
                className={errors.username ? "error" : ""}
              />
            </div>
          </div>
          {errors.username && <p className="error-message">{errors.username}</p>}

          {/* Password */}
          <div className="input-group">
            <label className="label" htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <FaLock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập password"
                className={errors.password ? "error" : ""}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {errors.password && <p className="error-message">{errors.password}</p>}

          {/* Remember me + button */}
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lưu mật khẩu</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Login"}
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>hoặc</span>
          </div>

          {/* Social login */}
          <div className="social-login">
            <button type="button" className="social-btn email">
              <FaEnvelope /> Email
            </button>
            <button type="button" className="social-btn facebook">
              <FaFacebook /> Facebook
            </button>
            <button type="button" className="social-btn linkedin">
              <FaLinkedin /> LinkedIn
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
