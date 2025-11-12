import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Domains() {
  const [domains, setDomains] = useState([])

  useEffect(() => {
    api('/domains').then(d => setDomains(d.domains)).catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Choose your domain</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          {domains.map((d) => (
            <Link key={d} to={`/roadmap/${encodeURIComponent(d)}`} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{d}</h2>
              <p className="text-gray-600 mt-1">Follow a guided learning path</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
