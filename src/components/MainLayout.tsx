import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, MessageSquare, User, LogOut } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col md:flex-row text-[#1a1a1a]">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-[#e8e4dc] flex-col sticky top-0 h-screen p-6">
        <div
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-white shadow-lg">
            🌿
          </div>
          <span className="font-bold text-xl tracking-tight">MindEase</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
          <NavItem
            icon={<MessageSquare size={20} />}
            label="Chat Sessions"
            onClick={() => navigate("/chat")}
          />
          <NavItem
            icon={<User size={20} />}
            label="Profile"
            onClick={() => navigate("/profile")}
          />
        </nav>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* MOBILE NAVIGATION */}
      <nav className="md:hidden bg-white border-t border-[#e8e4dc] sticky bottom-0 z-50 px-6 py-3 flex justify-around items-center">
        <MobileTab
          icon={<LayoutDashboard size={20} />}
          label="Home"
          onClick={() => navigate("/dashboard")}
        />
        <MobileTab
          icon={<MessageSquare size={20} />}
          label="Chat"
          onClick={() => navigate("/chat")}
        />
        <MobileTab
          icon={<User size={20} />}
          label="Profile"
          onClick={() => navigate("/profile")}
        />
      </nav>
    </div>
  );
}

// Reusable Components
function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
        active
          ? "bg-[#d8f3dc] text-[#1b4332]"
          : "text-[#8c887d] hover:bg-[#f7f5f0] hover:text-[#1a1a1a]"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function MobileTab({ icon, label, active = false, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 min-w-[64px]"
    >
      <div className={`${active ? "text-[#2d6a4f]" : "text-[#b5b1a6]"}`}>
        {icon}
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-tighter ${active ? "text-[#2d6a4f]" : "text-[#b5b1a6]"}`}
      >
        {label}
      </span>
    </button>
  );
}
