import Link from "next/link";
import { Calendar, Trash2, BarChart3, ExternalLink, Edit3 } from "lucide-react";

interface SurveyItem {
  id: string;
  title: string;
  description?: string;
  expiresAt: string;
  published: boolean;
  createdAt: string;
}

interface SurveyCardProps {
  item: SurveyItem;
  onDelete: (id: string) => void;
}

export default function SurveyCard({ item, onDelete }: SurveyCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition flex flex-col justify-between space-y-6 shadow-xl group">
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
            onClick={() => onDelete(item.id)}
            title="Delete Survey"
            className="p-2.5 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 rounded-xl text-rose-400 transition flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {!item.published && (
            <Link
              href={`/surveys/${item.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-sky-400 transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Draft
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}