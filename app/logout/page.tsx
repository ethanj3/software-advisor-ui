'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function doSignOut() {
      await supabase.auth.signOut()
      router.push('/login')
    }
    doSignOut()
  }, [router])

  return <p className="p-6">Signing you out...</p>
}
