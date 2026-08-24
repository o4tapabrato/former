"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation"; // <--- Import useSearchParams
import SurveyTakerForm from "@/app/components/survey/SurveyTakerForm";

export default function SurveyTakerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const surveyId = params?.id as string;
  const token = searchParams.get("token") || undefined;

  const [survey, setSurvey] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSurveyData() {
      try {
        const res = await fetch(`/api/surveys/responses/${surveyId}`);
        if (res.ok) {
          const data = await res.json();
          setSurvey(data.data);
        } else {
          setError("Survey not found or no longer available.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load survey.");
      } finally {
        setIsLoading(false);
      }
    }

    if (surveyId) {
      fetchSurveyData();
    }
  }, [surveyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading survey...
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-slate-950 text-rose-400 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-xl font-bold">Oops!</h2>
        <p className="text-sm">{error || "Survey not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Survey Header */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 shadow-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{survey.title}</h1>
          {survey.description && (
            <p className="text-slate-400 text-sm leading-relaxed">{survey.description}</p>
          )}
        </div>

        {/* Interactive Taker Form */}
        <SurveyTakerForm 
          surveyId={survey.id} 
          questions={survey.questions} 
          token={token}
        />

      </div>
    </div>
  );
}