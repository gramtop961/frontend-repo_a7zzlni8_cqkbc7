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

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // 2-50 chars, letters with optional space/hyphen/apostrophe in-between
  const nameRegex = /^[A-Za-z][A-Za-z\s'-]{0,48}[A-Za-z]$/

  const validate = (fields = {}) => {
    const v = { ...errors }
    if ('first_name' in fields) {
      if (!first_name) v.first_name = 'First name is required'
      else if (!nameRegex.test(first_name)) v.first_name = 'Use only letters (2-50), may include spaces, hyphens, apostrophes'
      else delete v.first_name
    }
    if ('last_name' in fields) {
      if (!last_name) v.last_name = 'Last name is required'
      else if (!nameRegex.test(last_name)) v.last_name = 'Use only letters (2-50), may include spaces, hyphens, apostrophes'
      else delete v.last_name
    }
    setErrors(v)
    return v
  }

  const isFormValid = () => {
    const v = validate({ first_name, last_name })
    return Object.keys(v).length === 0
  }

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }))
    if (field === 'first_name') validate({ first_name })
    if (field === 'last_name') validate({ last_name })
  }

  const handleNameChange = (setter, key) => (e) => {
    const raw = e.target.value
    const cleaned = raw.replace(/[^A-Za-z\s'-]/g, '')
    setter(cleaned)
    validate({ [key]: cleaned })
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setPhone(value)
  }

  const handlePhoneKeyDown = (e) => {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (allowed.includes(e.key)) return
    if (e.ctrlKey || e.metaKey) return
    if (!/^[0-9]$/.test(e.key)) e.preventDefault()
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isFormValid()) {
      setTouched({ first_name: true, last_name: true })
      return
    }

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                type="text"
                value={first_name}
                onChange={handleNameChange(setFirst, 'first_name')}
                onBlur={() => handleBlur('first_name')}
                required
                placeholder="John"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.first_name && touched.first_name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                aria-invalid={!!(errors.first_name && touched.first_name)}
              />
              {errors.first_name && touched.first_name && (
                <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                type="text"
                value={last_name}
                onChange={handleNameChange(setLast, 'last_name')}
                onBlur={() => handleBlur('last_name')}
                required
                placeholder="Doe"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.last_name && touched.last_name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                aria-invalid={!!(errors.last_name && touched.last_name)}
              />
              {errors.last_name && touched.last_name && (
                <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact number</label>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onKeyDown={handlePhoneKeyDown}
              onChange={handlePhoneChange}
              placeholder="Digits only"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Digits only, no other characters.</p>
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
