"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Copy, Check, Plus, Upload, FileText, KeyRound, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function SurveyDetailsPage() {
  const params = useParams();
  const surveyId = params?.id as string;

  const [survey, setSurvey] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [surveyRes, tokenRes] = await Promise.all([
          fetch(`/api/surveys/responses/${surveyId}`),
          fetch(`/api/surveys/responses/${surveyId}/link`),
        ]);

        if (surveyRes.ok) {
          const sData = await surveyRes.json();
          setSurvey(sData.data);
        }
        if (tokenRes.ok) {
          const tData = await tokenRes.json();
          setTokens(tData.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (surveyId) loadData();
  }, [surveyId]);

  const generateSingleToken = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/surveys/responses/${surveyId}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 1 })
      });
      const data = await res.json();
      if (res.ok) {
        setTokens((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetch(`/api/surveys/${surveyId}/export`);
      if (!res.ok) throw new Error("Export failed");

      // Get the response as a blob (binary data)
      const blob = await res.blob();

      // Create a temporary local URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create an invisible <a> tag to trigger the download programmatically
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey-${surveyId}-responses.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download CSV responses.");
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setIsUploadingCsv(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        const rows = lines.length > 1 && lines[0].toLowerCase().includes("email") ? lines.slice(1) : lines;

        const res = await fetch(`/api/surveys/${surveyId}/tokens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ labels: rows }),
        });

        const data = await res.json();
        if (res.ok) {
          setTokens(data.data);
          setCsvFile(null);
          alert(`Successfully generated ${rows.length} unique links from CSV!`);
        } else {
          alert("Failed to process CSV batch.");
        }
      } catch (err) {
        console.error(err);
        alert("Error parsing CSV file.");
      } finally {
        setIsUploadingCsv(false);
      }
    };
    reader.readAsText(csvFile);
  };

  const copyToClipboard = (tokenStr: string, id: string) => {
    const fullUrl = `${window.location.origin}/survey/${surveyId}?token=${tokenStr}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">Loading survey details...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Navigation Header */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Survey Info Card */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-white">{survey?.title}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Policy: {survey?.restrictionPolicy}
            </span>
          </div>
          <p className="text-sm text-slate-400">{survey?.description || "No description provided."}</p>
        </div>

        {/* Link Generators (Only visible if UNIQUE_TOKENS policy is active) */}
        {survey?.restrictionPolicy === "UNIQUE_TOKENS" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Single Link Generator */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-sky-400" /> Single Link Generator
                </h2>
                <p className="text-xs text-slate-400 mt-1">Generate an individual single-use invite link on demand.</p>
              </div>
              <button
                onClick={generateSingleToken}
                disabled={isGenerating}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-sky-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {isGenerating ? "Generating..." : "Generate Unique Link"}
              </button>
            </div>

            {/* CSV Bulk Generator */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Bulk CSV Generator
                </h2>
                <p className="text-xs text-slate-400 mt-1">Upload a CSV file containing respondent emails/records to batch-create links.</p>
              </div>
              <form onSubmit={handleCsvUpload} className="space-y-3">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-750 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={!csvFile || isUploadingCsv}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> {isUploadingCsv ? "Processing CSV..." : "Upload & Generate Bulk Links"}
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
            Note: Unique link generation is only available when the survey restriction policy is set to <strong>UNIQUE_TOKENS</strong>.
          </div>
        )}

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition flex items-center gap-2 border border-slate-700/80 shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" /> Export Responses (CSV)
        </button>

        {/* Generated Links Management Table */}
        {survey?.restrictionPolicy === "UNIQUE_TOKENS" && (
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white">Generated Links ({tokens.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {tokens.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No unique links generated yet.</div>
              ) : (
                tokens.map((t) => {
                  const url = `${window.location.origin}/survey/${surveyId}?token=${t.token}`;
                  return (
                    <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800 gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono text-slate-300 truncate">{url}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${t.isUsed ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                          {t.isUsed ? "Used" : "Active"}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.token, t.id)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {copiedId === t.id ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}