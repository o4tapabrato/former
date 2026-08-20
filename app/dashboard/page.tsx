import Link from "next/link";
import { PlusCircle, FileText, GraduationCap } from "lucide-react";

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
            <p className="text-slate-400">Create and manage your surveys and online tests.</p>
          </div>
          <Link
            href="/survey/new"
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 rounded-2xl font-semibold transition shadow-lg shadow-sky-600/20"
          >
            <PlusCircle className="w-5 h-5" />
            Quick Create
          </Link>
        </div>

        {/* Creation Options Grid - Just 2 Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-200">What would you like to build?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Option 1: Survey */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Survey</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Design versatile feedback forms, data collection sheets, or questionnaires supporting multi-choice, text inputs, ratings, and images.
                </p>
              </div>
              <Link
                href="/survey/new?type=survey"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
              >
                Create Survey &rarr;
              </Link>
            </div>

            {/* Option 2: Online Test / Quiz */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Online Test / Quiz</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Build graded examinations with answer keys, automatic scoring, point allocations, and countdown timers.
                </p>
              </div>
              <Link
                href="/survey/new?mode=quiz"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Create Test &rarr;
              </Link>
            </div>

          </div>
        </div>

        {/* Recent Surveys Section */}
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-200">Recent Forms & Tests</h2>
          <div className="p-10 rounded-3xl bg-slate-950 border border-slate-900 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>You haven't created anything yet. Choose an option above to get started!</p>
          </div>
        </div>

      </div>
    </div>
  );
}