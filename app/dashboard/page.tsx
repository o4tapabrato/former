"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Copy, Check, ExternalLink, ClipboardList } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch user surveys on mount
  useEffect(() => {
    async function fetchUserSurveys() {
      try {
        const res = await fetch("/api/surveys");
        if (res.ok) {
          const data = await res.json();
          setSurveys(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserSurveys();
  }, []);

  const handleCopyLink = (surveyId: string) => {
    const link = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(surveyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your surveys and share links to collect responses.</p>
          </div>
          <Link
            href="/survey/new"
            className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-2xl transition flex items-center gap-2 shadow-lg shadow-sky-600/20"
          >
            <Plus className="w-5 h-5" />
            Create Survey
          </Link>
        </div>

        {/* Surveys Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-sky-400" />
            Active Surveys
          </h2>

          {isLoading ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-500">
              Loading your surveys...
            </div>
          ) : surveys.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 space-y-3">
              <p className="text-slate-400 text-sm">You haven't created any surveys yet.</p>
              <Link
                href="/create-survey"
                className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-semibold rounded-xl transition"
              >
                Create your first survey
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {surveys.map((survey) => {
                const isCopied = copiedId === survey.id;
                return (
                  <div 
                    key={survey.id}
                    className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-slate-700"
                  >
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">{survey.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-1">{survey.description || "No description provided."}</p>
                      <p className="text-[10px] text-slate-500 pt-1">Created on {new Date(survey.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => handleCopyLink(survey.id)}
                        className={`px-4 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                          isCopied 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? "Copied Link!" : "Copy Link"}
                      </button>

                      <Link
                        href={`/survey/${survey.id}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                        title="Preview Survey"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}