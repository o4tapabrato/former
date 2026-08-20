import Link from "next/link";
import { FileText, LayoutDashboard, PlusCircle, LogOut, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-105 transition shadow-lg shadow-sky-500/10">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Survey<span className="text-sky-400">Craft</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            Dashboard
          </Link>
          <Link
            href="/survey/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" />
            New Survey
          </Link>
        </nav>

        {/* Right Actions (Profile / Logout) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>Developer</span>
          </div>

          <Link
            href="/api/auth/logout" // Adjust to your logout route
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}