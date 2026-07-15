import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AlertTriangle, Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'reset') {
        await resetPassword(email)
        setSuccess('Password reset email sent! Check your inbox.')
        setEmail('')
      } else if (mode === 'signup') {
        await signUp(email, password)
        setSuccess('Account created! Check your email to verify.')
        setEmail('')
        setPassword('')
      } else {
        await signIn(email, password)
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors duration-300" style={{ background: 'var(--bg-primary)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full bg-emerald-500/20 blur-[120px] animate-nebula-1" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-blue-500/20 blur-[120px] animate-nebula-2" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NEXUS AI</h1>
          <p className="text-sm text-zinc-400">
            {mode === 'reset' ? 'Reset your password' : mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <div className="border rounded-2xl p-8 shadow-2xl transition-colors duration-300" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : mode === 'reset' ? (
                'Send Reset Email'
              ) : mode === 'signup' ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>



          <div className="mt-6 text-center space-y-2">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  Don't have an account? <span className="text-emerald-400">Sign up</span>
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
                className="text-xs text-zinc-400 hover:text-white transition"
              >
                Back to <span className="text-emerald-400">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
