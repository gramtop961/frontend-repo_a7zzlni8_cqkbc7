import { useState } from 'react'
import { api, setToken } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [contact, setContact] = useState('')

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const nameRegex = /^[A-Za-z][A-Za-z\s'-]{0,48}[A-Za-z]$/ // 2-50 chars, letters with optional space/hyphen/apostrophe

  const validate = (fieldValues = {}) => {
    const v = { ...errors }
    if ('firstName' in fieldValues) {
      if (!firstName) v.firstName = 'First name is required'
      else if (!nameRegex.test(firstName)) v.firstName = 'Use only letters (2-50), may include spaces, hyphens, apostrophes'
      else delete v.firstName
    }
    if ('lastName' in fieldValues) {
      if (!lastName) v.lastName = 'Last name is required'
      else if (!nameRegex.test(lastName)) v.lastName = 'Use only letters (2-50), may include spaces, hyphens, apostrophes'
      else delete v.lastName
    }
    // Contact: no validation other than digit-only input handling
    setErrors(v)
    return v
  }

  const isFormValid = () => {
    const v = validate({ firstName, lastName })
    return Object.keys(v).length === 0
  }

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }))
    if (field === 'firstName') validate({ firstName })
    if (field === 'lastName') validate({ lastName })
  }

  const handleContactChange = (e) => {
    // Only allow digits, no other validation
    const value = e.target.value.replace(/\D/g, '')
    setContact(value)
  }

  const handleContactKeyDown = (e) => {
    // Block non-digit keys except control/navigation keys
    const allowed = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ]
    if (allowed.includes(e.key)) return
    if (e.ctrlKey || e.metaKey) return
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleNameChange = (setter, key) => (e) => {
    const raw = e.target.value
    const cleaned = raw.replace(/[^A-Za-z\s'-]/g, '')
    setter(cleaned)
    validate({ [key]: cleaned })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isFormValid()) {
      setTouched({ firstName: true, lastName: true })
      return
    }

    setLoading(true)
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false })
      setToken(res.token)
      navigate('/domains')
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
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-600 mb-6">Login to continue your Lernify Road</p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={handleNameChange(setFirstName, 'firstName')}
                onBlur={() => handleBlur('firstName')}
                required
                placeholder="John"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.firstName && touched.firstName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              {errors.firstName && touched.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={handleNameChange(setLastName, 'lastName')}
                onBlur={() => handleBlur('lastName')}
                required
                placeholder="Doe"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.lastName && touched.lastName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              {errors.lastName && touched.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact number</label>
            <input
              type="tel"
              inputMode="numeric"
              value={contact}
              onKeyDown={handleContactKeyDown}
              onChange={handleContactChange}
              placeholder="Digits only"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Digits only, no other characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
      </div>
    </div>
  )
}
