import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Domains from './pages/Domains'
import Roadmap from './pages/Roadmap'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Resume from './pages/Resume'
import Navbar from './Navbar'
import { getToken } from './lib/api'

function Protected({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return children
}

function HomeHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-extrabold">Lernify Road</h1>
        <p className="text-gray-700 mt-2">Pick a domain, follow the roadmap, take interactive assessments, and build your resume.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link className="px-4 py-2 bg-blue-600 text-white rounded" to="/login">Get Started</Link>
          <Link className="px-4 py-2 bg-gray-800 text-white rounded" to="/register">Create account</Link>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeHero />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/domains" element={<Protected><Domains /></Protected>} />
      <Route path="/roadmap/:domain" element={<Protected><Roadmap /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/resume" element={<Protected><Resume /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
