import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { sendMessage, AIModel, ChatMessage } from "../services/chatService";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import { detectCrisis, CRISIS_MESSAGE } from "../utils/crisisDetection";
import { Trash2 } from "lucide-react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface Session {
  id: string;
  title: string;
  model: AIModel;
  created_at: string;
}

export default function ChatPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function fetchSessions() {
    setSessionsLoading(true);
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSessions(data);
    setSessionsLoading(false);
  }

  async function loadSession(session: Session) {
    setActiveSession(session);
    setShowCrisis(false);
    setMessagesLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
    setMessagesLoading(false);
  }

  async function createNewSession() {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user!.id, model: "groq", title: "New Journey" })
      .select()
      .single();
    if (error) return addToast("Error starting session", "error");
    setSessions([data, ...sessions]);
    setActiveSession(data);
    setMessages([]);
  }

  async function deleteSession(sessionId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);
    if (error) {
      addToast("Could not delete chat.", "error");
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
    addToast("Chat deleted.", "info");
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending || !activeSession) return;
    setInput("");
    const userMsg: Message = {
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (detectCrisis(text)) setShowCrisis(true);
    await supabase
      .from("messages")
      .insert({ session_id: activeSession.id, role: "user", content: text });

    setSending(true);
    try {
      const history: ChatMessage[] = [...messages, userMsg]
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));
      const reply = await sendMessage(history, "groq");
      const assistantMsg: Message = {
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      await supabase.from("messages").insert({
        session_id: activeSession.id,
        role: "assistant",
        content: reply,
      });
    } catch {
      addToast("Connection lost. Try again.", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#f7f5f0] text-[#1a1a1a]">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* SIDEBAR - Bento Styled */}
      <aside
        className={`bg-white border-r border-[#e8e4dc] transition-all duration-500 ease-in-out flex flex-col ${sidebarOpen ? "w-80" : "w-0 opacity-0"}`}
      >
        <div className="p-8 flex items-center justify-between">
          <span className="text-[#2d6a4f] font-bold text-xl tracking-tighter">
            🌿 MindEase
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#aaa] hover:text-[#2d6a4f] transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={createNewSession}
            className="w-full py-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Start New Journey
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-[0.2em] px-4 mb-4">
            Past Conversations
          </p>
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => loadSession(s)}
              className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 ${activeSession?.id === s.id ? "bg-[#f0faf4] text-[#2d6a4f]" : "hover:bg-[#f7f5f0] text-[#777]"}`}
            >
              <span className="text-sm font-medium truncate">{s.title}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  aria-label="Delete conversation"
                  title="Delete"
                  className="p-1 rounded-md text-[#bdbdbd] hover:text-[#e74c3c] hover:bg-[#fff0f0] transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </nav>

        {/* profile btn */}
        <button
          onClick={() => navigate("/profile")}
          className="w-70 py-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold truncate">{user?.email}</span>
            <span className="text-[10px] text-[#aaa]">Premium Member</span>
          </div>
        </button>

        {/* signout */}
        <div className="p-6 m-4 bg-[#f7f5f0] rounded-3xl space-y-4">
          <button
            onClick={() => signOut()}
            className="w-full py-2 text-xs font-bold text-[#888] border border-[#e0dcd4] rounded-xl hover:bg-white transition-all"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-white border border-[#e8e4dc] rounded-xl text-[#2d6a4f] shadow-sm"
              >
                ☰
              </button>
            )}
            <h2 className="font-bold text-lg">
              {activeSession ? activeSession.title : "Welcome Back"}
            </h2>
          </div>
        </header>

        {showCrisis && (
          <div className="mx-8 mb-4 bg-[#fff8f0] border border-[#fad0a0] p-6 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#9c4a00] mb-1">
                  {CRISIS_MESSAGE.title}
                </h3>
                <p className="text-sm text-[#7a3a00] opacity-80">
                  {CRISIS_MESSAGE.body}
                </p>
              </div>
              <button
                onClick={() => setShowCrisis(false)}
                className="text-[#c47a2a] p-2 hover:bg-[#fce8cc] rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {!activeSession ? (
              <div className="h-full flex flex-col items-center justify-center pt-20 text-center">
                <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center text-4xl shadow-sm border border-[#e8e4dc] mb-6">
                  🌿
                </div>
                <h1 className="text-3xl font-black mb-2">
                  How are you, really?
                </h1>
                <p className="text-[#888] max-w-sm leading-relaxed">
                  Your privacy and mental peace are our priority. Start a
                  session to talk.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group animate-in fade-in duration-700`}
                >
                  <div className={`max-w-[75%] space-y-2`}>
                    <div
                      className={`p-5 text-[15px] leading-relaxed shadow-sm ${
                        msg.role === "assistant"
                          ? "bg-white border border-[#e8e4dc] rounded-[28px] rounded-bl-none text-[#1a1a1a]"
                          : "bg-[#2d6a4f] text-white rounded-[28px] rounded-br-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e8e4dc] p-5 rounded-[28px] rounded-bl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#2d6a4f] rounded-full" />
                    <div className="w-2 h-2 bg-[#2d6a4f] rounded-full" />
                    <div className="w-2 h-2 bg-[#2d6a4f] rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT PANEL - Floating Bento Style */}
        <footer className="p-8">
          <div className="max-w-4xl mx-auto">
            <div
              className={`relative flex items-end gap-4 bg-white border border-[#e8e4dc] p-3 rounded-[32px] shadow-xl transition-all duration-300 ${!activeSession ? "opacity-50 grayscale" : "focus-within:border-[#2d6a4f] focus-within:ring-4 ring-[#d8f3dc]/30"}`}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), handleSend())
                }
                placeholder={
                  activeSession
                    ? "Share what's on your mind..."
                    : "Start a new session above"
                }
                disabled={!activeSession || sending}
                className="flex-1 bg-transparent border-none outline-none text-[15px] p-4 resize-none min-h-[56px] max-h-40 overflow-y-auto"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !activeSession || sending}
                className="mb-1 mr-1 w-12 h-12 bg-[#2d6a4f] text-white rounded-2xl flex items-center justify-center hover:bg-[#1b4332] disabled:bg-[#ccc] transition-all transform active:scale-95"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "↑"
                )}
              </button>
            </div>
            <p className="mt-4 text-center text-[11px] text-[#bbb] font-medium uppercase tracking-widest">
              MindEase • Fully Encrypted • Professional Support
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
