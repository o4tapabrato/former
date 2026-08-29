"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SurveyHeader } from "@/app/components/survey-details/SurveyHeader";
import { SurveyTokensSection } from "@/app/components/survey-details/SurveyTokensSection";
import { SurveyAnalyticsSection } from "@/app/components/survey-details/SurveyAnalyticsSection";

export default function SurveyDetailsPage() {
  const params = useParams();
  const surveyId = params?.id as string;

  const [analytics, setAnalytics] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Analytics & Survey Meta
        const analyticsRes = await fetch(`/api/surveys/${surveyId}/analytics`);
        if (analyticsRes.ok) {
          const json = await analyticsRes.json();
          setAnalytics(json.data);
        }

        // Fetch Tokens if the survey uses unique links/tokens
        const tokensRes = await fetch(`/api/surveys/responses/${surveyId}/link`);
        if (tokensRes.ok) {
          const json = await tokensRes.json();
          setTokens(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (surveyId) loadData();
  }, [surveyId]);

  const handleExportCsv = async () => {
    try {
      const res = await fetch(`/api/surveys/${surveyId}/export`);
      if (!res.ok) throw new Error("Failed to download CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey-${surveyId}-responses.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading CSV export.");
    }
  };

  const handleCopyPublicLink = () => {
    const surveyUrl = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(surveyUrl);
    setCopiedId("public");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyTokenLink = (token: string) => {
    const tokenUrl = `${window.location.origin}/survey/${surveyId}?token=${token}`;
    navigator.clipboard.writeText(tokenUrl);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateToken = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch(`/api/surveys/responses/${surveyId}/link`, { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        setTokens((prev) => [json.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">Loading survey dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Actions Component */}
        <SurveyHeader
          analytics={analytics}
          copiedId={copiedId}
          onCopyPublicLink={handleCopyPublicLink}
          onExportCsv={handleExportCsv}
        />

        {/* Tokens / Unique Links Management Section Component (Conditional) */}
        {analytics?.restrictionPolicy === "UNIQUE_TOKENS" && (
          <SurveyTokensSection
            tokens={tokens}
            isGenerating={isGenerating}
            copiedId={copiedId}
            onGenerateToken={handleGenerateToken}
            onCopyTokenLink={handleCopyTokenLink}
          />
        )}

        {/* Inline Analytics Section Component */}
        <SurveyAnalyticsSection analytics={analytics} />

      </div>
    </div>
  );
}