"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Calendar, Layers, ExternalLink } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description?: string;
  expiresAt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentSurveys() {
      try {
        const res = await fetch("/api/dashboard/recent-surveys");
        const data = await res.json();
        if (res.ok) {
          setSurveys(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch surveys", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentSurveys();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your active tests and track responses seamlessly.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Button to view all surveys */}
            <Link 
              href="dashboard/all-activities"
              className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-200 transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              View All Surveys
            </Link>

            {/* Create New Survey Button */}
            <Link 
              href="/create-survey"
              className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Survey
            </Link>
          </div>
        </div>

        {/* Recent Surveys Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Active Surveys (Top 5)</h2>
            <Link href="/surveys/all" className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition">
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="text-sm text-slate-500 py-12 text-center">Loading recent surveys...</div>
          ) : surveys.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-3">
              <p className="text-sm text-slate-400">No active surveys found.</p>
              <Link 
                href="/survey/new"
                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline"
              >
                Create your first survey now <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            // Grid layout splitting the width to showcase items side-by-side (responsive up to 3-5 columns)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {surveys.map((survey) => (
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
                      <Link
                        href={`/survey/${survey.id}`}
                        target="_blank"
                        className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center text-xs font-semibold text-slate-300 transition flex items-center justify-center gap-1.5"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}