"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Plus, Loader2, KeyRound } from "lucide-react";

interface SurveyTokenManagerProps {
  surveyId: string;
  restrictionPolicy: string;
}

interface TokenRecord {
  id: string;
  token: string;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
}

export default function SurveyTokenManager({ surveyId, restrictionPolicy }: SurveyTokenManagerProps) {
  const [tokens, setTokens] = useState<TokenRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Only show this widget if policy is UNIQUE_TOKENS
  if (restrictionPolicy !== "UNIQUE_TOKENS") {
    return null;
  }

  // Fetch tokens for this survey
  useEffect(() => {
    async function fetchTokens() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/surveys/${surveyId}/tokens`);
        const data = await res.json();
        if (res.ok) {
          setTokens(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch tokens", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTokens();
  }, [surveyId]);

  const generateNewToken = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/tokens`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setTokens((prev) => [data.data, ...prev]);
      } else {
        alert("Failed to generate token.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (tokenStr: string, tokenId: string) => {
    const fullUrl = `${window.location.origin}/survey/${surveyId}?token=${tokenStr}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(tokenId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Unique Access Links</h2>
            <p className="text-xs text-slate-400">Generate single-use invite links for respondents.</p>
          </div>
        </div>

        <button
          onClick={generateNewToken}
          disabled={isGenerating}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 shadow-lg shadow-sky-600/20 cursor-pointer"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Generate Link
        </button>
      </div>

      {/* Token List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-6 text-slate-500 text-sm">Loading tokens...</div>
        ​) : tokens.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
            No unique tokens generated yet. Click "Generate Link" to create one.
          </div>
        ) : (
          tokens.map((t) => {
            const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/survey/${surveyId}?token=${t.token}`;
            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-slate-300 truncate">{inviteUrl}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.isUsed
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {t.isUsed ? "Used" : "Active / Unused"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Created: {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(t.token, t.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedId === t.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}