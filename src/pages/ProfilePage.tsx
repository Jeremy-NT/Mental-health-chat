import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  ShieldCheck, 
  Trash2, 
  ChevronLeft, 
  Mail,
  Calendar,
  Save,
  AlertTriangle
} from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState("");

  const firstName = fullName?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  async function handleUpdateName() {
    if (!fullName.trim()) return;
    setNameLoading(true); setNameSuccess(false); setError("");
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", user!.id);
    setNameLoading(false);
    if (error) { setError(error.message); return; }
    setNameSuccess(true);
    setTimeout(() => setNameSuccess(false), 3000);
  }

  async function handleUpdatePassword() {
    setError(""); setPassSuccess(false);
    if (!newPassword) { setError("Please enter a new password."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match."); return; }
    setPassLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPassLoading(false);
    if (error) { setError(error.message); return; }
    setPassSuccess(true);
    setNewPassword(""); setConfirmPassword("");
    setTimeout(() => setPassSuccess(false), 3000);
  }

  return (
    <div className="flex-1 overflow-y-auto">
        {/* MOBILE TOP BAR */}
        <header className="md:hidden flex items-center px-6 py-4 bg-white border-b border-[#e8e4dc] sticky top-0 z-50">
          <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 text-[#2d6a4f]">
            <ChevronLeft size={24} />
          </button>
          <span className="ml-2 font-bold text-lg">Account Settings</span>
        </header>

        <div className="max-w-3xl mx-auto p-6 md:p-12 lg:p-16">
          
          {/* PROFILE HEADER */}
          <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
            <div className="w-24 h-24 rounded-[32px] bg-[#2d6a4f] text-white flex items-center justify-center text-4xl font-bold shadow-2xl shadow-emerald-900/20">
              {firstName[0].toUpperCase()}
            </div>
            <div className="text-center md:text-left pt-2">
              <h1 className="text-3xl font-extrabold tracking-tight">{fullName || "Your Account"}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#8c887d] mt-1">
                <Mail size={14} />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
            </div>
          </section>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* NAME SETTINGS */}
            <div className="bg-white rounded-[32px] p-8 border border-[#e8e4dc] shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[#2d6a4f]">
                <User size={18} strokeWidth={2.5} />
                <h2 className="font-bold uppercase text-[11px] tracking-[0.2em]">Public Identity</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 bg-[#f7f5f0] border border-[#e8e4dc] focus:border-[#2d6a4f] rounded-2xl px-5 py-4 text-sm outline-none transition-all"
                  placeholder="Full Name"
                />
                <button
                  onClick={handleUpdateName}
                  disabled={nameLoading}
                  className="px-8 py-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  {nameSuccess ? "Saved ✓" : "Save Changes"}
                </button>
              </div>
            </div>

            {/* SECURITY SETTINGS */}
            <div className="bg-white rounded-[32px] p-8 border border-[#e8e4dc] shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[#2d6a4f]">
                <ShieldCheck size={18} strokeWidth={2.5} />
                <h2 className="font-bold uppercase text-[11px] tracking-[0.2em]">Security & Privacy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="bg-[#f7f5f0] border border-[#e8e4dc] focus:border-[#2d6a4f] rounded-2xl px-5 py-4 text-sm outline-none transition-all"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="bg-[#f7f5f0] border border-[#e8e4dc] focus:border-[#2d6a4f] rounded-2xl px-5 py-4 text-sm outline-none transition-all"
                />
              </div>
              <button
                onClick={handleUpdatePassword}
                disabled={passLoading}
                className="w-full md:w-auto px-8 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold text-sm transition-all hover:bg-black active:scale-95 disabled:opacity-50"
              >
                {passSuccess ? "Password Updated ✓" : "Update Password"}
              </button>
            </div>

            {/* ACCOUNT INFO */}
            <div className="bg-white rounded-[32px] p-8 border border-[#e8e4dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-[#8c887d]">
                <Calendar size={20} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">
                    {new Date(user?.created_at || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="h-px md:h-8 w-full md:w-px bg-[#e8e4dc]" />
              <div className="text-sm text-[#8c887d] font-medium">
                Encrypted & Secure Session Data
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-red-50/50 rounded-[32px] p-8 border border-red-100 mt-12">
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <Trash2 size={18} strokeWidth={2.5} />
                <h2 className="font-bold uppercase text-[11px] tracking-[0.2em]">Danger Zone</h2>
              </div>
              <p className="text-xs text-red-800/60 mb-6 font-medium leading-relaxed">
                Deleting your account is permanent and will wipe your entire conversation history.
              </p>
              {!showDelete ? (
                <button
                  onClick={() => setShowDelete(true)}
                  className="text-red-600 font-bold text-sm hover:underline"
                >
                  Delete my account
                </button>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="w-full bg-white border border-red-200 focus:border-red-500 rounded-2xl px-5 py-4 text-sm text-red-600 font-bold outline-none"
                  />
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all">
                      Confirm Deletion
                    </button>
                    <button 
                      onClick={() => setShowDelete(false)}
                      className="px-6 py-4 bg-white border border-[#e8e4dc] rounded-2xl font-bold text-sm text-[#8c887d]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      
    </div>
  );
}