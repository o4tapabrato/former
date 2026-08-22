import { Calendar } from "lucide-react";

interface SurveyMetaEditorProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  expiresAt: string;
  setExpiresAt: (val: string) => void;
}

export default function SurveyMetaEditor({
  title,
  setTitle,
  description,
  setDescription,
  expiresAt,
  setExpiresAt,
}: SurveyMetaEditorProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent text-2xl font-extrabold text-white border-b border-slate-800 pb-2 focus:outline-none focus:border-sky-500"
        placeholder="Survey Title"
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-transparent text-slate-400 text-sm resize-none focus:outline-none"
        placeholder="Survey description (optional)..."
        rows={2}
      />

      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-sky-400" />
          Expiration Date & Time (Required - Default 7 Days)
        </label>
        <input 
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          required
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
        />
        <p className="text-[11px] text-slate-500">Respondents will not be able to submit answers after this deadline.</p>
      </div>
    </div>
  );
}