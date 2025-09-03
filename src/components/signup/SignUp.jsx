// Register.jsx
import { useState, useRef, useEffect } from "react"
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash
} from "react-icons/fa"
import "../login/Login" // dùng chung styles & animation shake

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCTV, setIsCTV] = useState(false)
  const [errors, setErrors] = useState({})
  const [isShaking, setIsShaking] = useState(false)

  // refs cho input
  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = e.target.username.value.trim()
    const email = e.target.email.value.trim()
    const password = e.target.password.value.trim()
    const confirmPassword = e.target.confirmPassword.value.trim()

    const newErrors = {}
    let hasError = false

    if (!username) {
      newErrors.username = "Vui lòng nhập tài khoản"
      hasError = true
    }
    if (!email) {
      newErrors.email = "Vui lòng nhập email"
      hasError = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ"
      hasError = true
    }
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
      hasError = true
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự"
      hasError = true
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
      hasError = true
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
      hasError = true
    }

    setErrors(newErrors)

    if (hasError) {
      // hiệu ứng shake
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)

      // focus vào input lỗi đầu tiên
      if (newErrors.username) usernameRef.current.focus()
      else if (newErrors.email) emailRef.current.focus()
      else if (newErrors.password) passwordRef.current.focus()
      else if (newErrors.confirmPassword) confirmRef.current.focus()

      return
    }

    setIsSubmitting(true)
    // giả lập API call
    setTimeout(() => {
      setIsSubmitting(false)
      console.log("Register success:", { username, email, password, ctv: isCTV })
    }, 1500)
  }

  return (
    <div className="container">
      <form className={`form ${isShaking ? "shake" : ""}`} onSubmit={handleSubmit}>
        <p className="title"><p style={{fontWeight:"bold"}}>Tạo tài khoản mới</p></p>

        {/* Username */}
        <div className="input-group">
          <label className="label" htmlFor="username">Tài khoản</label>
          <div className="input-wrapper">
            <FaUser className="icon" />
            <input
              ref={usernameRef}
              id="username"
              name="username"
              type="text"
              placeholder="Nhập username"
              className={errors.username ? "error" : ""}
            />
          </div>
        </div>
        {errors.username && <p className="error-message">{errors.username}</p>}

        {/* Email */}
        <div className="input-group">
          <label className="label" htmlFor="email">Email</label>
          <div className="input-wrapper">
            <FaEnvelope className="icon" />
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email"
              className={errors.email ? "error" : ""}
            />
          </div>
        </div>
        {errors.email && <p className="error-message">{errors.email}</p>}

        {/* Password */}
        <div className="input-group">
          <label className="label" htmlFor="password">Mật khẩu</label>
          <div className="input-wrapper">
            <FaLock className="icon" />
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className={errors.password ? "error" : ""}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(s => !s)}
              aria-hidden
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}

        {/* Confirm Password */}
        <div className="input-group">
          <label className="label" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <div className="input-wrapper">
            <FaLock className="icon" />
            <input
              ref={confirmRef}
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className={errors.confirmPassword ? "error" : ""}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirm(s => !s)}
              aria-hidden
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        {/* CTV checkbox + submit */}
        <div className="form-options">
          <div className="remember-me">
            <input
              id="ctv"
              name="ctv"
              type="checkbox"
              checked={isCTV}
              onChange={(e) => setIsCTV(e.target.checked)}
            />
            <label htmlFor="ctv">Đăng ký với tư cách CTV</label>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner"></span> : "Đăng ký"}
          </button>
        </div>
      </form>
    </div>
  )
}
