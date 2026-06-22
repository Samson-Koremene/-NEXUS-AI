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

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()
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

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070809] p-4">
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
        <div className="bg-[#0d0e10] border border-white/10 rounded-2xl p-8 shadow-2xl">
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

          {mode === 'login' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0d0e10] px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </>
          )}

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
