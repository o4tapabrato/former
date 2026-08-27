"use client";

import Link from "next/link";
import { FileText, Trash2, Calendar, Clock } from "lucide-react";

interface SurveyCardProps {
  item: {
    id: string;
    title: string;
    description?: string;
    expiresAt: string;
    published: boolean;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export default function SurveyCard({ item, onDelete }: SurveyCardProps) {
  const isExpired = new Date(item.expiresAt) < new Date();

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between transition hover:border-slate-700">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">{item.title}</h2>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
              item.published && !isExpired
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {isExpired ? "Expired" : item.published ? "Active" : "Draft"}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {item.description || "No description provided."}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Created: {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
          <Link
            href={`/dashboard/surveys/${item.id}`}
            className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 text-center"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" /> Survey Details
          </Link>

          <button
            onClick={() => onDelete(item.id)}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition cursor-pointer"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}