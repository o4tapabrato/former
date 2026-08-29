import { Link2, Plus, Check, Copy } from "lucide-react";

interface SurveyTokensSectionProps {
  tokens: any[];
  isGenerating: boolean;
  copiedId: string | null;
  onGenerateToken: () => void;
  onCopyTokenLink: (token: string) => void;
}

export function SurveyTokensSection({
  tokens,
  isGenerating,
  copiedId,
  onGenerateToken,
  onCopyTokenLink,
}: SurveyTokensSectionProps) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-400" /> Unique Invite Links & Tokens
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generate single-use unique links to control exact respondents.</p>
        </div>
        <button
          onClick={onGenerateToken}
          disabled={isGenerating}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> {isGenerating ? "Generating..." : "Generate New Link"}
        </button>
      </div>

      {tokens.length === 0 ? (
        <div className="p-6 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-500">
          No unique token links generated yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {tokens.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${t.used ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                  {t.used ? "Used" : "Active"}
                </span>
                <span className="font-mono text-slate-300 truncate">...{t.token.slice(-12)}</span>
              </div>

              <button
                onClick={() => onCopyTokenLink(t.token)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                {copiedId === t.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                {copiedId === t.token ? "Copied" : "Copy Link"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}