import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import { api } from '../lib/api'

export default function Roadmap() {
  const { domain } = useParams()
  const [data, setData] = useState({ steps: [], progress: 0 })
  const [submitState, setSubmitState] = useState({})

  useEffect(() => {
    api(`/roadmap/${encodeURIComponent(domain)}`).then(setData)
  }, [domain])

  const submit = async (idx, answers) => {
    try {
      setSubmitState(s => ({...s, [idx]: { status: 'saving' }}))
      const res = await api('/assessment/submit', { method: 'POST', body: { domain, step_index: idx, answers } })
      setSubmitState(s => ({...s, [idx]: { status: res.passed ? 'passed' : 'failed', score: res.score, total: res.total, results: res.results }}))
      const refreshed = await api(`/roadmap/${encodeURIComponent(domain)}`)
      setData(refreshed)
    } catch (e) {
      setSubmitState(s => ({...s, [idx]: { status: 'error', message: e.message }}))
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{domain}</h1>
        <p className="text-gray-600 mb-6">Progress: step {data.progress} / {data.steps.length}</p>
        <div className="space-y-4">
          {data.steps.map(step => (
            <StepCard key={step.index} step={step} locked={step.locked} onSubmit={submit} state={submitState[step.index]} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepCard({ step, locked, onSubmit, state }) {
  const [answers, setAnswers] = useState([])

  const status = state?.status
  const score = state?.score
  const total = state?.total
  const results = state?.results || []

  return (
    <div className={`bg-white rounded-xl p-5 shadow ${locked ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{step.index}. {step.title}</h2>
        {status === 'passed' && <span className="text-green-700 text-sm font-medium">Passed ✔ ({score}/{total})</span>}
        {status === 'failed' && <span className="text-red-700 text-sm font-medium">Score: {score}/{total} — Try again</span>}
      </div>
      <p className="text-gray-600 mt-1">{step.description}</p>
      <div className="flex gap-2 mt-3 flex-wrap">
        {step.videos.map((v,i)=>(
          <a key={i} href={v} target="_blank" className="px-3 py-2 bg-red-600 text-white rounded hover:opacity-90">YouTube {i+1}</a>
        ))}
      </div>
      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold">Quick Assessment</h3>
        {step.quiz.questions.map((q, i) => (
          <div key={i} className="mt-2">
            <p className="text-sm font-medium">{i+1}. {q.q}</p>
            <div className="mt-1 flex flex-col gap-1">
              {q.a.map((a, ai) => {
                const selected = answers[i] === ai
                const showWrong = status && results.length === step.quiz.questions.length && selected && results[i] === false
                return (
                  <label key={ai} className="inline-flex items-center gap-2 text-sm">
                    <input type="radio" name={`q-${step.index}-${i}`} onChange={()=>setAnswers(prev=>{ const n=[...prev]; n[i]=ai; return n })} />
                    <span>{a}</span>
                    {showWrong && <span className="text-red-600 ml-2">This answer is wrong, try again</span>}
                  </label>
                )
              })}
            </div>
          </div>
        ))}
        <button disabled={locked || status==='saving'} onClick={()=>onSubmit(step.index, answers)} className="mt-3 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">{locked? 'Locked' : status==='saving' ? 'Submitting...' : 'Submit'}</button>
        {status && (status === 'passed' || status === 'failed') && (
          <div className="mt-2 text-sm text-gray-700">Your score for this assessment: <span className="font-semibold">{score}/{total}</span></div>
        )}
      </div>
    </div>
  )
}
