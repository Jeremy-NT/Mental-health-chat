import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError('')
    if (!fullName || !email || !password) {
      setError('Please provide your name, email, and a password to begin.')
      return
    }
    if (password.length < 6) {
      setError('To keep your space secure, please use at least 6 characters.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/chat')
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6 font-sans">
      {/* Gentle background decorative elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-50/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[460px] space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-800 font-bold text-xl hover:opacity-80 transition-opacity">
            <span>🌿</span> MindEase
          </Link>
          <h1 className="text-3xl font-serif font-medium text-slate-900 mt-4">Begin your journey</h1>
          <p className="text-slate-500 text-sm">Create a private space to reflect and grow.</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100/50 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-sm animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">
                How should we call you?
              </label>
              <input
                type="text"
                placeholder="Your preferred name"
                className="w-full bg-[#FDFCF9]/50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700 placeholder:text-slate-300"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#FDFCF9]/50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700 placeholder:text-slate-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">
                Choose a Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full bg-[#FDFCF9]/50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700 placeholder:text-slate-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
              />
            </div>
          </div>

          <button 
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 mt-2"
            onClick={handleSignup} 
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create my safe space'
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-800 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-xl bg-slate-100/50 text-slate-500">
                <span className="text-xs">🔒</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">End-to-End Private</span>
            </div>
            <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-xl bg-slate-100/50 text-slate-500">
                <span className="text-xs">✨</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Always Ad-Free</span>
            </div>
        </div>
      </div>
    </div>
  )
}