import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { features } from './Data'



export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-10')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-800 selection:bg-emerald-100 font-sans">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#FDFCF9]/80 backdrop-blur-md border-b border-emerald-100/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold tracking-tight text-emerald-900">MindEase</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Sign in</button>
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-emerald-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                A safe harbor for your thoughts
              </span>
              <h1 className="mt-6 text-5xl lg:text-6xl font-serif font-medium leading-[1.15] text-slate-900">
                Exhale. <br />
                <span className="italic text-emerald-700 font-normal">We're here to listen.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                MindEase provides a compassionate, AI-driven space to navigate life's challenges. 
                No appointments, no judgment—just a private path to clarity.
              </p>
            </div>

            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-bold text-lg hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
              >
                Start for free
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                Sign in
              </button>
            </div>
            <p className="text-sm text-slate-400 italic">Trusted by 10,000+ users finding their calm.</p>
          </div>

          {/* INTERACTIVE CHAT PREVIEW */}
          <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300 relative group">
            <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-100/50 overflow-hidden">
              <div className="bg-emerald-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100/20 flex items-center justify-center text-white font-bold border border-white/10">M</div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">MindEase Guide</h4>
                    <p className="text-emerald-300 text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Always online
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-100/60 font-bold bg-emerald-900/50 px-2 py-1 rounded">Private</span>
              </div>
              <div className="p-8 space-y-6 min-h-[350px] bg-gradient-to-b from-white to-emerald-50/20">
                <div className="bg-slate-100 text-slate-700 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm leading-relaxed">
                  Hi there. It takes courage to open up. How are you feeling in this moment?
                </div>
                <div className="bg-emerald-700 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm shadow-md">
                  I've been feeling really overwhelmed with everything lately...
                </div>
                <div className="bg-slate-100 text-slate-700 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm leading-relaxed border border-emerald-100/50">
                  I hear you. That "everything" can feel like a heavy weight. Do you want to try a 2-minute breathing exercise or just talk it out?
                </div>
                <div className="flex gap-2 p-2">
                  <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
            {/* Soft decorative ring */}
            <div className="absolute -inset-4 bg-emerald-100/20 rounded-[3rem] blur-xl -z-10 scale-95 group-hover:scale-100 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="reveal opacity-0 translate-y-10 transition-all duration-700 text-4xl font-serif font-bold text-slate-900">
              Gentle tools for a clearer mind
            </h2>
            <p className="reveal opacity-0 translate-y-10 transition-all duration-700 delay-100 text-slate-500 text-lg">
              We focus on the small details that make digital support feel human.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div 
                key={i}
                className="reveal opacity-0 translate-y-10 transition-all duration-700 p-8 rounded-3xl bg-[#FDFCF9] border border-emerald-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block"><f.icon /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6">
        <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 max-w-5xl mx-auto bg-emerald-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-serif font-medium text-emerald-50 leading-tight">
              Ready to find your quiet place?
            </h2>
            <p className="text-emerald-100/70 text-lg max-w-xl mx-auto">
              Join a community where your mental wellbeing is the only priority. Start your first conversation today.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-2xl active:scale-95"
            >
              Create your safe space
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-emerald-900 tracking-tight">MindEase</span>
            </div>
            <p className="text-slate-500 text-sm italic">"The journey of a thousand miles begins with a single breath."</p>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 mb-2">Crisis Resources</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                MindEase is an AI companion, not a replacement for professional clinical care. 
                If you are in immediate danger or experiencing a crisis, please call <strong>988</strong> (USA) or your local emergency services immediately.
              </p>
            </div>
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} MindEase. Built with compassion for the human mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}