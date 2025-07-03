// File: app/layout.tsx

import './styles/globals.css'  // adjust path if your globals live elsewhere

export const metadata = {
  title: 'Software Advisor',
  description: 'Your AI-powered software platform recommendation engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head />
      <body className="flex h-full flex-col antialiased text-gray-900">
        {/* ─── Header ───────────────────────────────────────────────────────── */}
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold">Software Advisor</h1>
            {/* Add global nav here if desired */}
          </div>
        </header>

        {/* ─── Main Content ────────────────────────────────────────────────── */}
        <main className="flex-grow">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {children}
          </div>
        </main>

        {/* ─── Footer ───────────────────────────────────────────────────────── */}
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Software Advisor. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
