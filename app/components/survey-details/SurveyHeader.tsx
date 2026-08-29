import { ArrowLeft, Users, Download, Copy, Check } from "lucide-react";
import Link from "next/link";

interface SurveyHeaderProps {
  analytics: any;
  copiedId: string | null;
  onCopyPublicLink: () => void;
  onExportCsv: () => void;
}

export function SurveyHeader({ analytics, copiedId, onCopyPublicLink, onExportCsv }: SurveyHeaderProps) {
  return (
    <>
      {/* Navigation Header */}
      <Link href="/dashboard/surveys" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Surveys
      </Link>

      {/* Title Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active Survey
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-2">{analytics?.surveyTitle || "Survey Dashboard"}</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Total Responses Badge */}
          <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-2xl border border-slate-800">
            <Users className="w-5 h-5 text-sky-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Submissions</p>
              <p className="text-base font-black text-white">{analytics?.totalResponses ?? 0}</p>
            </div>
          </div>

          {/* Public Link Copy Button */}
          <button
            onClick={onCopyPublicLink}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-2xl transition flex items-center gap-2 border border-slate-700 shadow-md cursor-pointer"
            title="Copy public link"
          >
            {copiedId === "public" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
            {copiedId === "public" ? "Copied!" : "Copy Link"}
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-2xl transition flex items-center gap-2 border border-slate-700 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
        </div>
      </div>
    </>
  );
}