import { useState } from 'react'
import { api } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

const QUALS = [
  'BCA', 'MCA', 'BSc CS', 'MSc CS', 'B.Tech CSE', 'BE CSE', 'B.Tech IT', 'BE IT', 'Data Science', 'AI/ML', 'Computer Engineering', 'Information Technology'
]

export default function Register() {
  const [first_name, setFirst] = useState('')
  const [last_name, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [qualification, setQual] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api('/auth/register', { method: 'POST', auth: false, body: { first_name, last_name, email, phone, qualification, password } })
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-600 mb-6">Only IT-related qualifications are allowed</p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input value={first_name} onChange={(e)=>setFirst(e.target.value)} required minLength={2} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input value={last_name} onChange={(e)=>setLast(e.target.value)} required minLength={2} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" pattern="[0-9]{10,15}" value={phone} onChange={(e)=>setPhone(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Qualification</label>
            <select value={qualification} onChange={(e)=>setQual(e.target.value)} required className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>Select qualification</option>
              {QUALS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </div>
    </div>
  )
}
