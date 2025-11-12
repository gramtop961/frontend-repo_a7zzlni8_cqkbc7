import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { api } from '../lib/api'

export default function Resume() {
  const [data, setData] = useState({ summary: '', skills: [], education: [], experience: [], projects: [] })
  const [msg, setMsg] = useState('')

  useEffect(()=>{ api('/resume').then(setData) },[])

  const addTo = (key, obj) => setData(d => ({...d, [key]: [...d[key], obj]}))
  const removeAt = (key, idx) => setData(d => ({...d, [key]: d[key].filter((_,i)=>i!==idx)}))

  const save = async () => {
    setMsg('')
    // basic client validations
    if (!data.summary || data.skills.length === 0) { setMsg('Add a summary and at least one skill'); return }
    await api('/resume', { method: 'POST', body: data })
    setMsg('Saved')
  }

  const download = async () => {
    const res = await api('/resume/download')
    const blob = new Blob([res.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Build your Resume</h1>
        {msg && <p className="text-sm text-gray-700 mb-2">{msg}</p>}
        <div className="space-y-4">
          <Section title="Summary">
            <textarea value={data.summary} onChange={(e)=>setData({...data, summary: e.target.value})} className="w-full border rounded p-2" rows={4} />
          </Section>

          <Section title="Skills">
            <SkillEditor skills={data.skills} setSkills={(s)=>setData({...data, skills: s})} />
          </Section>

          <ListSection title="Education" items={data.education} placeholder={{ degree: '', institution: '', year: '' }} setItems={(items)=>setData({...data, education: items})} />
          <ListSection title="Experience" items={data.experience} placeholder={{ role: '', company: '', duration: '', details: '' }} setItems={(items)=>setData({...data, experience: items})} />
          <ListSection title="Projects" items={data.projects} placeholder={{ name: '', description: '' }} setItems={(items)=>setData({...data, projects: items})} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          <button onClick={download} className="px-4 py-2 bg-gray-800 text-white rounded">Download</button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  )
}

function SkillEditor({ skills, setSkills }) {
  const [input, setInput] = useState('')
  const add = () => { if (input.trim()) { setSkills([...skills, input.trim()]); setInput('') } }
  const remove = (i) => setSkills(skills.filter((_,idx)=>idx!==i))
  return (
    <div>
      <div className="flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="e.g. React" className="flex-1 border rounded px-3 py-2" />
        <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map((s,i)=> (
          <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">{s} <button onClick={()=>remove(i)} className="ml-1 text-red-600">×</button></span>
        ))}
      </div>
    </div>
  )
}

function ListSection({ title, items, placeholder, setItems }) {
  const add = () => setItems([...items, placeholder])
  const update = (i, key, value) => setItems(items.map((it,idx)=> idx===i ? { ...it, [key]: value } : it))
  const remove = (i) => setItems(items.filter((_,idx)=>idx!==i))

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <button onClick={add} className="mb-3 px-3 py-2 bg-blue-600 text-white rounded">Add</button>
      <div className="space-y-3">
        {items.map((it,i)=> (
          <div key={i} className="grid md:grid-cols-3 gap-3 items-start">
            {Object.keys(placeholder).map((k)=>(
              <input key={k} value={it[k]} onChange={(e)=>update(i,k,e.target.value)} placeholder={k} className="border rounded px-3 py-2" />
            ))}
            <button onClick={()=>remove(i)} className="px-3 py-2 bg-red-600 text-white rounded">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
