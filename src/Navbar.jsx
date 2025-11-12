import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from './lib/api'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const authed = !!getToken()

  const logout = () => {
    clearToken()
    navigate('/login')
  }

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${pathname === path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to={authed ? '/domains' : '/'} className="text-xl font-extrabold text-blue-700">Lernify Road</Link>
          <div className="flex gap-2 items-center">
            {authed ? (
              <>
                <Link className={linkClass('/domains')} to="/domains">Domains</Link>
                <Link className={linkClass('/dashboard')} to="/dashboard">Dashboard</Link>
                <Link className={linkClass('/profile')} to="/profile">Profile</Link>
                <button onClick={logout} className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-black">Logout</button>
              </>
            ) : (
              <>
                <Link className={linkClass('/login')} to="/login">Login</Link>
                <Link className={linkClass('/register')} to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
