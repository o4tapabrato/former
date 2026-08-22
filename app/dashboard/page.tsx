"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import RecentSurveysGrid from "../components/dashboard/RecentSurveyGrid";

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
        
        {/* Modular Header */}
        <DashboardHeader />

        {/* Recent Surveys Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Active Surveys (Top 5)</h2>
            <Link href="/dashboard/all-activities" className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition">
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RecentSurveysGrid surveys={surveys} loading={loading} />
        </div>

      </div>
    </div>
  );
}