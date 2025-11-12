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
  const contactRegex = /^\d{10}$/

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
    if ('contact' in fieldValues) {
      if (!contact) v.contact = 'Contact number is required'
      else if (!contactRegex.test(contact)) v.contact = 'Enter a valid 10-digit number'
      else delete v.contact
    }
    setErrors(v)
    return v
  }

  const isFormValid = () => {
    const v = validate({ firstName, lastName, contact })
    return Object.keys(v).length === 0
  }

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }))
    if (field === 'firstName') validate({ firstName })
    if (field === 'lastName') validate({ lastName })
    if (field === 'contact') validate({ contact })
  }

  const handleContactChange = (e) => {
    // Allow only digits and limit to 10
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setContact(value)
    validate({ contact: value })
  }

  const handleNameChange = (setter, key) => (e) => {
    // Trim leading spaces, keep only valid characters for feedback
    const raw = e.target.value
    const cleaned = raw.replace(/[^A-Za-z\s'-]/g, '')
    setter(cleaned)
    validate({ [key]: cleaned })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isFormValid()) {
      setTouched({ firstName: true, lastName: true, contact: true })
      return
    }

    setLoading(true)
    try {
      // Backend login requires only email/password. Extra fields validated client-side only.
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
              pattern="\\d{10}"
              value={contact}
              onChange={handleContactChange}
              onBlur={() => handleBlur('contact')}
              required
              placeholder="10-digit number"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.contact && touched.contact ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.contact && touched.contact && (
              <p className="mt-1 text-xs text-red-600">{errors.contact}</p>
            )}
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
