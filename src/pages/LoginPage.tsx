import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { 
      setError('Please share both your email and password to continue.') 
      return 
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { 
      setError(error.message)
      return 
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6 font-sans">
      {/* Background soft glow */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-800 font-bold text-xl hover:opacity-80 transition-opacity">
            <span>🌿</span> MindEase
          </Link>
          <h1 className="text-3xl font-serif font-medium text-slate-900 mt-4">Welcome back</h1>
          <p className="text-slate-500 text-sm">Take a deep breath and continue your journey.</p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-sm border border-emerald-100/50 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-sm animate-in fade-in slide-in-from-top-1">
              <span className="font-semibold">Note:</span> {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#FDFCF9] border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700 placeholder:text-slate-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-emerald-700 hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#FDFCF9] border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700 placeholder:text-slate-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <button 
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
            onClick={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              New to MindEase?{' '}
              <Link to="/signup" className="text-emerald-800 font-bold hover:underline">
                Create a safe space
              </Link>
            </p>
          </div>
        </div>

        {/* Security Reassurance */}
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <div className="h-[1px] flex-1 bg-slate-200" />
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-xs">🔒</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Encrypted & Secure</span>
          </div>
          <div className="h-[1px] flex-1 bg-slate-200" />
        </div>
      </div>
    </div>
  )
}