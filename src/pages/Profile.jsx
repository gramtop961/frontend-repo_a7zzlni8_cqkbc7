import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { api } from '../lib/api'

export default function Profile() {
  const [me, setMe] = useState(null)
  const [first_name, setFirst] = useState('')
  const [last_name, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=>{ api('/me').then(d=>{ setMe(d); setFirst(d.first_name); setLast(d.last_name); setPhone(d.phone) }) },[])

  const save = async () => {
    setMsg('')
    try {
      await api('/me', { method: 'PUT', body: { first_name, last_name, phone } })
      setMsg('Saved')
    } catch(e) { setMsg(e.message) }
  }

  if (!me) return <div className="min-h-screen"><Navbar /><div className="p-6">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <div className="bg-white rounded-xl p-6 shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First name</label>
              <input value={first_name} onChange={(e)=>setFirst(e.target.value)} className="w-full border rounded px-3 py-2"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Last name</label>
              <input value={last_name} onChange={(e)=>setLast(e.target.value)} className="w-full border rounded px-3 py-2"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2"/>
            </div>
          </div>
          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </div>
      </div>
    </div>
  )
}
