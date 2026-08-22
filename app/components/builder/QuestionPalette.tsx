import { ListOrdered, CheckSquare, AlignLeft, Star, Image as ImageIcon } from "lucide-react";

interface QuestionPaletteProps {
  onAddQuestion: (type: "MULTIPLE_CHOICE" | "CHECKBOX" | "TEXT" | "RATING" | "IMAGE_CHOICE") => void;
}

export default function QuestionPalette({ onAddQuestion }: QuestionPaletteProps) {
  return (
    <div className="sticky top-24 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
      <h3 className="text-lg font-bold text-white tracking-tight">Question Types</h3>
      <div className="space-y-2.5">
        <button
          onClick={() => onAddQuestion("MULTIPLE_CHOICE")}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
        >
          <ListOrdered className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Multiple Choice</span>
        </button>
        <button
          onClick={() => onAddQuestion("CHECKBOX")}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
        >
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-white">Checkboxes</span>
        </button>
        <button
          onClick={() => onAddQuestion("TEXT")}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
        >
          <AlignLeft className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-white">Open Text</span>
        </button>
        <button
          onClick={() => onAddQuestion("RATING")}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
        >
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-semibold text-white">Rating Scale</span>
        </button>
        <button
          onClick={() => onAddQuestion("IMAGE_CHOICE")}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
        >
          <ImageIcon className="w-5 h-5 text-sky-400" />
          <span className="text-sm font-semibold text-white">Visual Choice</span>
        </button>
      </div>
    </div>
  );
}