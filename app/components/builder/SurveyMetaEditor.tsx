import { Calendar, ShieldAlert } from "lucide-react";

interface SurveyMetaEditorProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  expiresAt: string;
  setExpiresAt: (val: string) => void;
  restrictionPolicy: string;
  setRestrictionPolicy: (val: string) => void;
}

export default function SurveyMetaEditor({
  title,
  setTitle,
  description,
  setDescription,
  expiresAt,
  setExpiresAt,
  restrictionPolicy,
  setRestrictionPolicy,
}: SurveyMetaEditorProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent text-2xl font-extrabold text-white border-b border-slate-800 pb-2 focus:outline-none focus:border-sky-500 transition-colors"
        placeholder="Survey Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-transparent text-slate-400 text-sm resize-none focus:outline-none"
        placeholder="Survey description (optional)..."
        rows={2}
      />

      <div className="pt-4 border-t border-slate-800/80 space-y-4">
        {/* Expiration Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-400" />
            Expiration Date & Time (Required - Default 7 Days)
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
            className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
          />
          <p className="text-[11px] text-slate-500">Respondents will not be able to submit answers after this deadline.</p>
        </div>

        {/* Restriction Policy Field */}
        <div className="space-y-2 pt-2 border-t border-slate-800/40">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            Response Restriction Policy
          </label>
          <div className="relative">
            <select
              value={restrictionPolicy}
              onChange={(e) => setRestrictionPolicy(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner appearance-none cursor-pointer"
            >
              <option value="NONE" className="bg-slate-900 text-slate-200">None (Allow multiple responses)</option>
              <option value="ONE_PER_ACCOUNT" className="bg-slate-900 text-slate-200">One per Account (Requires login)</option>
              <option value="ONE_PER_DEVICE" className="bg-slate-900 text-slate-200">One per Device (Cookie/IP tracking)</option>
              <option value="UNIQUE_TOKENS" className="bg-slate-900 text-slate-200">Unique Token Links (Single-use tokens)</option>
            </select>
            {/* Custom dropdown arrow indicator */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Choose how duplicate submissions should be handled.</p>
        </div>
      </div>
    </div>
  );
}