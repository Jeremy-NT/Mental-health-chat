import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

interface Session {
  id: string;
  title: string;
  created_at: string;
}

const MOODS = [
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😕", label: "Meh", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

const TIPS = [
  "Take three slow, deep breaths whenever you feel overwhelmed.",
  "A short walk outside can reset your mood more than you'd expect.",
  "You don't have to solve everything today. One step at a time.",
  "Talking about what you feel is already a brave act.",
  "Rest is productive. Your mind needs it too.",
  "Small moments of gratitude rewire the brain over time.",
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const tip = TIPS[new Date().getDay() % TIPS.length];

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("chat_sessions")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setSessions(data);
      setLoading(false);
    }
    load();
  }, []);

  function handleMood(value: number) {
    setSelectedMood(value);
    setTimeout(() => setMoodSaved(true), 600);
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] font-sans selection:bg-[#d8f3dc]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* HERO HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#1a1a1a] tracking-tight mb-2">
            {greeting()}, <span className="text-[#2d6a4f]">{firstName}</span>
          </h1>
          <p className="text-sm text-[#8c887d] font-semibold uppercase tracking-[0.1em]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* BENTO SECTION: MOOD */}
        <div className="bg-white rounded-[32px] p-10 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8e4dc]/50 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d8f3dc]/30 rounded-full blur-3xl" />

          <header className="flex justify-between items-center mb-8">
            <p className="text-[11px] font-bold text-[#b5b1a6] uppercase tracking-[0.2em]">
              Self-Reflection
            </p>
            {moodSaved && (
              <span className="text-[10px] font-bold bg-[#d8f3dc] text-[#2d6a4f] px-3 py-1 rounded-full uppercase">
                Recorded
              </span>
            )}
          </header>

          <h2 className="text-2xl font-bold mb-8">How's your heart feeling?</h2>

          {!moodSaved ? (
            <div className="grid grid-cols-5 gap-4">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => handleMood(m.value)}
                  className="flex flex-col items-center gap-3 py-6 rounded-2xl border border-[#f0ece4] bg-[#fcfbf9] hover:bg-white hover:border-[#2d6a4f] hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 active:scale-95 transition-all group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {m.emoji}
                  </span>
                  <span className="text-[11px] font-bold text-[#8c887d] group-hover:text-[#2d6a4f] uppercase tracking-wider">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-6 p-6 bg-[#d8f3dc]/40 rounded-[24px] border border-[#b7e4c7]/50 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-sm">
                {MOODS.find((m) => m.value === selectedMood)?.emoji}
              </div>
              <div>
                <p className="text-lg font-bold text-[#1b4332]">
                  Thank you for checking in.
                </p>
                <p className="text-sm text-[#2d6a4f]/80">
                  Acknowledging you feel{" "}
                  <span className="font-bold underline">
                    {MOODS.find(
                      (m) => m.value === selectedMood,
                    )?.label.toLowerCase()}
                  </span>{" "}
                  is the first step today.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ACTION ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CHAT CTA */}
          <button
            onClick={() => navigate("/chat")}
            className="group relative flex flex-col justify-between bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-[32px] p-8 text-left transition-all shadow-xl shadow-emerald-950/10 hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl mb-12 shadow-inner">
              💬
            </div>
            <div>
              <p className="text-2xl font-bold mb-2">Reflect & Talk</p>
              <p className="text-sm text-white/70 leading-relaxed">
                Open a safe space to process your thoughts with MindEase.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">
              Start Session{" "}
              <span className="group-hover:translate-x-2 transition-transform">
                →
              </span>
            </div>
          </button>

          {/* DAILY TIP */}
          <div className="bg-white border border-[#e8e4dc]/50 rounded-[32px] p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-12 h-12 rounded-2xl bg-[#f7f5f0] flex items-center justify-center text-2xl mb-8">
              ✨
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#b5b1a6] uppercase tracking-[0.2em] mb-3">
                Today's Wisdom
              </p>
              <p className="text-lg text-[#444] leading-relaxed italic font-serif">
                "{tip}"
              </p>
            </div>
          </div>
        </div>

        {/* HISTORY LIST */}
        <div className="bg-white border border-[#e8e4dc]/50 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-bold text-[#b5b1a6] uppercase tracking-[0.2em]">
              Recent Conversations
            </h3>
            <button
              onClick={() => navigate("/chat")}
              className="text-xs font-bold text-[#2d6a4f] hover:underline px-4 py-2 bg-[#f7f5f0] rounded-full transition-colors"
            >
              History
            </button>
          </div>

          <div className="space-y-2">
            {loading ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-[20px] bg-[#f7f5f0] animate-pulse"
                />
              ))
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-[#b5b1a6] italic font-serif">
                  A journey of a thousand miles begins with a single word.
                </p>
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate("/chat")}
                  className="flex items-center justify-between p-5 rounded-[24px] hover:bg-[#f7f5f0]/50 border border-transparent hover:border-[#e8e4dc]/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d8f3dc] border border-[#2d6a4f]/20 group-hover:scale-125 transition-transform" />
                    <span className="text-base font-bold text-[#444] group-hover:text-[#1a1a1a] transition-colors truncate max-w-[200px]">
                      {s.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-[#b5b1a6] uppercase tracking-tighter">
                      {timeAgo(s.created_at)}
                    </span>
                    <span className="text-[#2d6a4f] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
