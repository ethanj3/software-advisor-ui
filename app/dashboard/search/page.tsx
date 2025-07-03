'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

const SEARCH_QUESTIONS = [
  {
    key: 'project_goals',
    label:
      '1. What are the primary financial and operational goals you hope to achieve from this engagement?'
  },
  {
    key: 'critical_deadlines',
    label:
      '2. Are there critical deadlines or upcoming audits we need to align with?'
  },
  {
    key: 'core_systems',
    label:
      '3. Which core systems do you currently use (e.g., accounting, CRM, payroll, inventory), and which are most critical for daily accuracy?'
  },
  {
    key: 'system_drivers',
    label:
      '3a. What was the driver behind adopting each system and how long has it been in place?'
  },
  {
    key: 'outdated_systems',
    label:
      '4. Are there any systems you feel are outdated or ineffective?'
  },
  {
    key: 'data_sharing',
    label:
      '5. How do your systems currently share data (e.g., APIs, exports/imports)? Where do you experience issues or manual workarounds?'
  },
  {
    key: 'roles_governance',
    label:
      '6. Who manages user roles, permissions, and system data governance?'
  },
  {
    key: 'power_users',
    label:
      '7. Who are the primary experts or power-users we should involve for insights and feedback?'
  },
  {
    key: 'process_improvement',
    label:
      '8. What key financial process do you believe needs the most improvement (e.g., month-end close, AP/AR)?'
  },
  {
    key: 'manual_steps',
    label:
      '9. Which steps within that process are heavily manual or error-prone?'
  },
  {
    key: 'exception_handling',
    label:
      '10. How are exceptions, errors, or discrepancies typically handled?'
  },
  {
    key: 'pain_points',
    label:
      '11. Which system inefficiencies or recurring issues cause the greatest frustration or delays?'
  },
  {
    key: 'manual_tasks',
    label:
      '12. What manual tasks or reconciliations do you most want automated or streamlined?'
  },
  {
    key: 'critical_reports',
    label:
      '13. Which critical reports or metrics do you depend on most, and what data issues (if any) impact their accuracy or timeliness?'
  },
  {
    key: 'missing_insights',
    label:
      '14. Are there key metrics or insights you currently lack visibility into?'
  },
  {
    key: 'training_support',
    label:
      '15. How are users trained or onboarded to new systems or as new hires?'
  },
]

export default function SearchPage() {
  const [answers, setAnswers] = useState(
    SEARCH_QUESTIONS.reduce((acc, q) => {
      acc[q.key] = ''
      return acc
    }, {} as Record<string, string>)
  )
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [pitch, setPitch] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleGenerate = async () => {
    setError(null)
    setPitch(null)
    setSuggestion(null)
    setLoading(true)

    // Build comma-separated search terms
    const terms = Object.values(answers).filter(Boolean).join(' ')

    // 1) Fuzzy search RPC
    let recs = await supabase
      .rpc('fts_search_platforms', { query: terms })
      .then(r => r.data || [])
      .catch(() => [])

    // 2) Pick first match or fallback to QBO
    const chosen =
      recs.length > 0
        ? (recs[0] as any).name
        : 'QuickBooks Online'

    setSuggestion(chosen)

    // 3) Generate pitch via API
    try {
      const res = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion: chosen }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'API error')
      setPitch(json.pitch)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Provide More Context</h1>

      {SEARCH_QUESTIONS.map(q => (
        <div key={q.key}>
          <label htmlFor={q.key} className="block font-medium mb-1">
            {q.label}
          </label>
          <textarea
            id={q.key}
            name={q.key}
            rows={3}
            value={answers[q.key]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}

      <button
        type="button"
        disabled={loading}
        onClick={handleGenerate}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Generating…' : 'Generate Pitch'}
      </button>

      {suggestion && (
        <p className="mt-4">
          <strong>Suggested software:</strong> {suggestion}
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {pitch && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Generated Pitch</h2>
          <p>{pitch}</p>
        </div>
      )}
    </div>
  )
}
