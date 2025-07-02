
import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUserAuth()
  }, [])

  const checkUserAuth = async () => {
    try {
      const response = await fetch('/__replauthuser')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.log('Not authenticated')
    }
    setLoading(false)
  }

  const loginWithReplit = () => {
    window.addEventListener("message", authComplete)
    const h = 500
    const w = 350
    const left = screen.width / 2 - w / 2
    const top = screen.height / 2 - h / 2

    const authWindow = window.open(
      "https://replit.com/auth_with_repl_site?domain=" + location.host,
      "_blank",
      "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    )

    function authComplete(e) {
      if (e.data !== "auth_complete") {
        return
      }
      window.removeEventListener("message", authComplete)
      authWindow.close()
      location.reload()
    }
  }

  const logout = () => {
    // Replit Auth doesn't have a direct logout, so we'll just refresh
    // In a real app, you'd clear session on server side
    location.reload()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🚀 간단 회원가입 사이트</h1>
        <p>Replit Auth로 쉽고 안전하게 가입하세요!</p>
      </header>

      {!user ? (
        <div className="auth-section">
          <div className="welcome-card">
            <h2>환영합니다!</h2>
            <p>Replit 계정으로 간편하게 로그인하거나 회원가입하세요.</p>
            <button onClick={loginWithReplit} className="login-btn">
              🔐 Replit으로 로그인/회원가입
            </button>
          </div>
          
          <div className="features">
            <h3>왜 우리 사이트를 선택해야 할까요?</h3>
            <ul>
              <li>✅ 빠르고 안전한 인증</li>
              <li>✅ 개인정보 보호</li>
              <li>✅ 간편한 사용법</li>
              <li>✅ 무료 서비스</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <div className="user-card">
            <div className="user-info">
              {user.profileImage && (
                <img src={user.profileImage} alt="프로필" className="profile-img" />
              )}
              <div className="user-details">
                <h2>안녕하세요, {user.name}님! 👋</h2>
                <p>성공적으로 로그인되었습니다.</p>
                {user.bio && <p className="bio">소개: {user.bio}</p>}
              </div>
            </div>
            <button onClick={logout} className="logout-btn">
              로그아웃
            </button>
          </div>

          <div className="dashboard-content">
            <h3>대시보드</h3>
            <div className="stats">
              <div className="stat-card">
                <h4>사용자 ID</h4>
                <p>{user.id}</p>
              </div>
              <div className="stat-card">
                <h4>가입일</h4>
                <p>{new Date().toLocaleDateString('ko-KR')}</p>
              </div>
              <div className="stat-card">
                <h4>상태</h4>
                <p>활성</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2024 간단 회원가입 사이트. Replit Auth로 구동됩니다.</p>
      </footer>
    </div>
  )
}
