import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-screen bg-[#070809]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm text-zinc-400">Completing sign in...</p>
      </div>
    </div>
  )
}
