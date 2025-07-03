'use client'

import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen p-6">
      <nav className="flex gap-4 border-b pb-4 mb-6 text-blue-600">
        <Link href="/dashboard/questionnaire">Questionnaire</Link>
        <Link href="/dashboard/search">Search Platforms</Link>
        <Link href="/dashboard/pitch">Generate Pitch</Link>
        <Link href="/login">Log Out</Link>
      </nav>
      <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
    </div>
  )
}
