import React, { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"
import { listNotifications, getBalances, resetDemoData } from "../api"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [readNotifIds, setReadNotifIds] = useState([])
  const [allNotifs, setAllNotifs] = useState([])
  const [balances, setBalances] = useState(getBalances())
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    listNotifications().then(setAllNotifs)
    setBalances(getBalances())
  }, [])

  const notifications = useMemo(() => {
    if (!user) return []
    return allNotifs
      .filter(n => n.role === user.role || n.role === "all")
      .sort((a,b) => b.createdAt - a.createdAt)
  }, [user, allNotifs])

  const storageKey = useMemo(() => (user ? `readNotif:${user.email || user.id}` : null), [user])

  useEffect(() => {
    if (!storageKey) return
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]")
      if (Array.isArray(saved)) setReadNotifIds(saved)
    } catch {}
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(readNotifIds))
    } catch {}
  }, [readNotifIds, storageKey])

  const unreadCount = useMemo(() => notifications.filter(n => !readNotifIds.includes(n.id)).length, [notifications, readNotifIds])

  const timeAgo = (ts) => {
    const diffMs = Date.now() - ts
    const mins = Math.floor(diffMs / 60000)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  const ctvBonus = useMemo(() => {
    if (!user || user.role !== "CTV") return 0
    const id = user.email || user.id || "CTV"
    return balances.ctvBonusById?.[id] || 0
  }, [balances, user])

  const handleLogout = () => { logout(); navigate("/login") }
  const handleReset = () => { resetDemoData(); window.location.reload() }

  const isActive = (path) => location.pathname === path
  const homePath = user?.role === 'admin' ? '/admin' : '/dashboard'
  const goHome = () => navigate(homePath)

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="logo">🚀 MyCompany</span>
      </div>

      <div className="navbar-right">
        {!user ? (
          <nav>
            <Link to="/login" className="nav-btn">Đăng nhập</Link>
            <Link to="/signup" className="nav-btn">hoặc đăng ký để vào hệ thống</Link>
          </nav>
        ) : (
          <div className="profile-dropdown" onMouseLeave={() => setOpen(false)}>
            {/* Search toggle */}
            <div className="search">
              {!showSearch ? (
                <span className="search-icon" onClick={() => setShowSearch(true)} title="Search">🔎</span>
              ) : (
                <div className="search-box">
                  <input
                    className="search-input"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <button className="search-close" onClick={() => { setShowSearch(false); setSearchText("") }} title="Close">✕</button>
                </div>
              )}
            </div>

            <div className="notif" onClick={() => { setOpenNotif(!openNotif); const ids = notifications.map(n => n.id); setReadNotifIds(prev => Array.from(new Set([...prev, ...ids]))) }}>
              <span className="bell">🔔</span>
              {notifications.length > 0 && (<span className={`dot ${unreadCount === 0 ? "gray" : ""}`}></span>)}
              {openNotif && (
                <div className="notif-menu" onMouseLeave={() => setOpenNotif(false)}>
                  {notifications.length === 0 && (<div className="notif-item">Không có thông báo</div>)}
                  {notifications.map(n => (
                    <div key={n.id} className="notif-item">
                      <span>🛈</span>
                      <span>{n.message}</span>
                      <span className="notif-time">{timeAgo(n.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {user.role === "admin" && (<span className="stat-pill">Credit: ${balances.adminCredit}</span>)}
            {user.role === "CTV" && (<span className="stat-pill">Bonus: ${ctvBonus}</span>)}
            <div className="profile-box" onClick={() => setOpen(!open)}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=FF5E62&color=fff`} alt="avatar" className="avatar" />
              <span className="username">{user.name || "CTV"}</span>
            </div>
            {open && (
              <ul className="dropdown-menu">
             
                <li className={isActive('/profile') ? 'active' : ''} onClick={() => navigate("/profile")}>View profile</li>
                <div className="dropdown-divider"></div>
                <li className={isActive(homePath) ? 'active' : ''} onClick={goHome}>Trang chủ</li>
                <li className={isActive('/my-brand') ? 'active' : ''} onClick={() => navigate("/my-brand")}>My brand</li>
                <li className={isActive('/my-candidates') ? 'active' : ''} onClick={() => navigate("/my-candidates")}>My candidates</li>
                <li className={isActive('/saved-jobs') ? 'active' : ''} onClick={() => navigate("/saved-jobs")}>Saved jobs</li>
                <div className="dropdown-divider"></div>
                <li onClick={handleReset}>Reset demo data</li>
                <li onClick={handleLogout}>Đăng xuất</li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
