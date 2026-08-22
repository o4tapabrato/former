import Link from "next/link";
import { Plus, Layers } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your active tests and track responses seamlessly.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard/all-activities"
          className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-200 transition flex items-center gap-2"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          View All Surveys
        </Link>

        <Link 
          href="/create-survey"
          className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Survey
        </Link>
      </div>
    </div>
  );
}