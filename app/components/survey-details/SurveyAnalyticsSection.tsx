"use client";

import { BarChart3, Star, MessageSquare, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface SurveyAnalyticsSectionProps {
  analytics: any;
}

export function SurveyAnalyticsSection({ analytics }: SurveyAnalyticsSectionProps) {
  // Custom color palette for charts matching your dark slate theme
  const chartColors = [
    "rgba(56, 189, 248, 0.85)",   // Sky blue
    "rgba(99, 102, 241, 0.85)",   // Indigo
    "rgba(16, 185, 129, 0.85)",   // Emerald
    "rgba(245, 158, 11, 0.85)",   // Amber
    "rgba(236, 72, 153, 0.85)",   // Pink
    "rgba(168, 85, 247, 0.85)",   // Purple
  ];

  const borderColors = [
    "rgba(56, 189, 248, 1)",
    "rgba(99, 102, 241, 1)",
    "rgba(16, 185, 129, 1)",
    "rgba(245, 158, 11, 1)",
    "rgba(236, 72, 153, 1)",
    "rgba(168, 85, 247, 1)",
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Response Analytics & Breakdown</h2>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Total Analyzed: <strong className="text-white">{analytics?.totalResponses ?? 0}</strong>
        </span>
      </div>

      {/* Question Analytics Cards */}
      {analytics?.questionAnalytics?.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-500">
          No questions or responses found for this survey yet.
        </div>
      ) : (
        analytics?.questionAnalytics?.map((q: any, index: number) => {
          // Prepare chart data for multiple choice / checkbox / image choice options
          const hasDistribution = (q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX" || q.type === "IMAGE_CHOICE") && q.distribution;
          
          const chartLabels = hasDistribution ? Object.keys(q.distribution) : [];
          const chartValues = hasDistribution ? Object.values(q.distribution) : [];

          const chartData = {
            labels: chartLabels,
            datasets: [
              {
                label: "Responses",
                data: chartValues,
                backgroundColor: chartColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 8,
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            plugins: {
              legend: {
                display: q.type === "IMAGE_CHOICE", // Show legend for images if preferred, hide for standard bars to keep clean
                labels: { color: "#94a3b8", font: { size: 11 } },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: "#94a3b8", font: { size: 11 } },
              },
              y: {
                beginAtZero: true,
                grid: { color: "rgba(30, 41, 59, 0.5)" },
                ticks: { color: "#94a3b8", font: { size: 11 }, precision: 0 },
              },
            },
          };

          const pieOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom" as const,
                labels: { color: "#94a3b8", font: { size: 11 }, boxWidth: 12 },
              },
            },
          };

          return (
            <div key={q.questionId} className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 shadow-xl transition hover:border-slate-700/80">
              
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs px-2.5 py-1 bg-slate-800 text-sky-400 rounded-lg font-mono font-bold mt-0.5 border border-slate-700/50">
                    Q{index + 1}
                  </span>
                  <h3 className="text-base font-bold text-white leading-relaxed">{q.text}</h3>
                </div>
                <span className="text-[10px] tracking-wider px-2.5 py-1 bg-slate-950 text-slate-400 rounded-lg font-semibold uppercase border border-slate-800 shrink-0">
                  {q.type.replace("_", " ")}
                </span>
              </div>

              {/* Multiple Choice / Checkbox: Interactive Histogram Bar & Pie Switcher / View */}
              {hasDistribution && analytics.totalResponses > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                  
                  {/* Histogram Bar Chart */}
                  <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Frequency Histogram</p>
                    <div className="h-48 flex items-center justify-center">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Proportional Pie Chart */}
                  <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 self-start">Distribution Share</p>
                    <div className="h-48 w-full flex items-center justify-center">
                      <Pie data={chartData} options={pieOptions} />
                    </div>
                  </div>

                </div>
              )}

              {/* Fallback if no responses yet for distribution */}
              {hasDistribution && analytics.totalResponses === 0 && (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-950/30 rounded-xl border border-slate-800">
                  Charts will render automatically once submissions arrive.
                </p>
              )}

              {/* Rating Metric Summary */}
              {q.type === "RATING" && (
                <div className="flex items-center gap-4 py-2">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 flex items-center gap-4 shadow-inner">
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Star className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{q.averageRating}</span>
                        <span className="text-xs text-slate-400 font-medium">/ 5.0 overall score</span>
                      </div>
                      <p className="text-[11px] text-amber-300/80 uppercase font-bold tracking-wider mt-0.5">
                        Based on {q.totalRated} verified ratings
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Answers List (Limited to Top 5 Recent) */}
              {q.type === "TEXT" && (
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-xs text-slate-400 pb-1 border-b border-slate-800/60">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Recent Text Submissions
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">{q.textAnswers.length} total</span>
                  </div>

                  {q.textAnswers.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-3">No text responses submitted yet.</p>
                  ) : (
                    <div className="grid gap-2.5">
                      {q.textAnswers.slice(0, 5).map((ans: string, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 text-xs text-slate-300 flex items-start gap-3 shadow-sm hover:bg-slate-950 transition">
                          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 mt-0.5 shrink-0">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                          <span className="leading-relaxed font-normal">{ans}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })
      )}
    </div>
  );
}