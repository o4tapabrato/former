"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, CheckSquare } from "lucide-react";
import SurveyCard from "@/app/components/survey/SurveyCard";

interface SurveyItem {
  id: string;
  title: string;
  description?: string;
  expiresAt: string;
  published: boolean;
  createdAt: string;
  type?: "survey" | "test";
}

export default function AllSurveysPage() {
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [activeTab, setActiveTab] = useState<"surveys" | "tests">("surveys");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllItems() {
      setLoading(true);
      try {
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
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeTab === "surveys"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Surveys
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeTab === "tests"
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
              <SurveyCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}