import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { api } from '../lib/api'

export default function Dashboard() {
  const [data, setData] = useState({ attempts: [], progress: {} })

  useEffect(()=>{ api('/dashboard').then(setData) },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(data.progress).map(([k,v]) => (
            <div key={k} className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-semibold">{k}</h3>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div className="h-2 bg-blue-600 rounded" style={{ width: `${v}%` }} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{v}% complete</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-2">Assessment History</h2>
        <div className="bg-white rounded-xl p-4 shadow">
          {data.attempts.length === 0 ? (
            <p className="text-gray-600">No attempts yet.</p>
          ) : (
            <ul className="divide-y">
              {data.attempts.map((a,i)=> (
                <li key={i} className="py-2 text-sm flex justify-between">
                  <span>{a.domain} - Step {a.step_index}</span>
                  <span>{a.score}/{a.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
