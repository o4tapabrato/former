"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Trash2,
  BarChart3,
  ExternalLink,
  Layers,
  CheckSquare,
  Edit3
} from "lucide-react";

interface SurveyItem {
  id: string;
  title: string;
  description?: string;
  expiresAt: string;
  published: boolean;
  createdAt: string;
  type?: "survey" | "test"; // Optional category differentiator if applicable
}

export default function AllSurveysPage() {
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [activeTab, setActiveTab] = useState<"surveys" | "tests">("surveys");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllItems() {
      setLoading(true);
      try {
        // Adjust endpoint if you have separate routes for surveys/tests
        const res = await fetch(`/api/surveys`);
        const data = await res.json();
        if (res.ok) {
          setItems(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch items", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllItems();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Error deleting survey:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">All Created Items</h1>
              <p className="text-sm text-slate-400 mt-1">Browse, inspect responses, or manage your full library of forms.</p>
            </div>

            {/* Switchable Tab Bar */}
            <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setActiveTab("surveys")}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${activeTab === "surveys"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <Layers className="w-3.5 h-3.5" /> Surveys
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${activeTab === "tests"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <CheckSquare className="w-3.5 h-3.5" /> Tests
              </button>
            </div>
          </div>
        </div>

        {/* Content Listing Area */}
        {loading ? (
          <div className="text-sm text-slate-500 py-24 text-center">Loading your library...</div>
        ) : items.length === 0 ? (
          <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-3">
            <p className="text-sm text-slate-400">No {activeTab} found in your library.</p>
            <Link
              href="/create-survey"
              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:underline"
            >
              Create a new one now &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition flex flex-col justify-between space-y-6 shadow-xl group"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-sky-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description || "No description provided."}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Expires: {new Date(item.expiresAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href={`/survey/${item.id}`}
                      className="flex-1 py-2.5 bg-sky-600/10 hover:bg-sky-600/20 border border-sky-500/30 rounded-xl text-center text-xs font-semibold text-sky-400 transition flex items-center justify-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Responses</span>
                    </Link>

                    <Link
                      href={`/survey/${item.id}`}
                      target="_blank"
                      title="Preview Survey"
                      className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete Survey"
                      className="p-2.5 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 rounded-xl text-rose-400 transition flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {!item.published && (
                      <Link
                        href={`/create-survey/${item.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-sky-400 transition shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Draft
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}