'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

interface Platform {
  id: number
  name: string
  use_case_fit: string
  pricing_tiers: string
  integrations: string
}

export default function PitchPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clientResponse, setClientResponse] = useState<Record<string, unknown> | null>(null)
  const [recommendations, setRecommendations] = useState<Platform[]>([])
  const [accepted, setAccepted] = useState<Record<number, boolean>>({})
  const [pitch, setPitch] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')

      const { data: respRows } = await supabase
        .from('client_responses')
        .select('*')
        .eq('submitted_by', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const resp = respRows?.[0] ?? null
      setClientResponse(resp)

      const query = Object.entries(resp || {})
        .filter(([k]) => k.startsWith('q') || k === 'desired_integrations')
        .map(([, v]) => Array.isArray(v) ? v.join(' ') : v)
        .join(' ')

      const { data: recs } = await supabase
        .rpc('fts_search_platforms', { query })

      const list = recs || []
      setRecommendations(list)

      const initMap: Record<number, boolean> = {}
      list.forEach((p: Platform) => {
        initMap[p.id] = true
      })
      setAccepted(initMap)

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleGenerate = async () => {
    setLoading(true)
    const chosen = recommendations.filter(p => accepted[p.id])

    const res = await fetch('/api/generate-pitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientResponse, recommendations: chosen })
    })

    const { pitch: text } = await res.json()
    setPitch(text)
    setLoading(false)
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Generate Pitch</h1>

      <div className="space-y-4">
        {recommendations.map(p => (
          <div key={p.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="mb-2">{p.use_case_fit}</p>
            <div className="flex gap-4">
              <button
                type="button"
                className={accepted[p.id] ? 'font-bold text-green-600' : 'text-gray-500'}
                onClick={() => setAccepted(prev => ({ ...prev, [p.id]: true }))}
              >
                Yes
              </button>
              <button
                type="button"
                className={!accepted[p.id] ? 'font-bold text-red-600' : 'text-gray-500'}
                onClick={() => setAccepted(prev => ({ ...prev, [p.id]: false }))}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Generate Pitch
      </button>

      {pitch && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Your Pitch</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{pitch}</pre>
          <form action="/api/download-pitch" method="POST">
            <input type="hidden" name="pitchText" value={pitch} />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
            >
              Download as .docx
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
