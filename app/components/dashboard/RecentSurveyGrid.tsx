"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ExternalLink, ArrowRight, Copy, Check } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description?: string;
  expiresAt: string;
  createdAt: string;
}

interface RecentSurveysGridProps {
  surveys: Survey[];
  loading: boolean;
}

export default function RecentSurveysGrid({ surveys, loading }: RecentSurveysGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string) => {
    const surveyUrl = `${window.location.origin}/survey/${id}`;
    navigator.clipboard.writeText(surveyUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
  };

  if (loading) {
    return <div className="text-sm text-slate-500 py-12 text-center">Loading recent surveys...</div>;
  }

  if (surveys.length === 0) {
    return (
      <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-3">
        <p className="text-sm text-slate-400">No active surveys found.</p>
        <Link 
          href="/create-survey"
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline"
        >
          Create your first survey now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {surveys.map((survey) => {
        const isCopied = copiedId === survey.id;
        return (
          <div 
            key={survey.id}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition flex flex-col justify-between space-y-4 shadow-lg group"
          >
            <div className="space-y-2">
              <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-sky-400 transition">
                {survey.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {survey.description || "No description provided."}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Expires: {new Date(survey.expiresAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview Button */}
                <Link
                  href={`/survey/${survey.id}`}
                  target="_blank"
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center text-xs font-semibold text-slate-300 transition flex items-center justify-center gap-1.5"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                {/* Copy Link Button */}
                <button
                  onClick={() => handleCopyLink(survey.id)}
                  title="Copy Submission Link"
                  className={`p-2 rounded-xl border transition flex items-center justify-center ${
                    isCopied 
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" 
                      : "bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}