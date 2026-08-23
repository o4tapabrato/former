"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // <--- Import useParams
import { Save, Loader2 } from "lucide-react";
import QuestionCard from "@/app/components/builder/QuestionCard";
import SurveyMetaEditor from "@/app/components/builder/SurveyMetaEditor";
import QuestionPalette from "@/app/components/builder/QuestionPalette";

interface BuilderQuestion {
  id: string;
  type: "MULTIPLE_CHOICE" | "CHECKBOX" | "TEXT" | "RATING" | "IMAGE_CHOICE";
  text: string;
  required: boolean;
  options: string[];
  imageUrl?: string;
  maxRating?: number;
}

export default function EditSurveyPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState<BuilderQuestion[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!surveyId) return;

    const fetchSurvey = async () => {
      try {
        const res = await fetch(`/api/surveys/${surveyId}`);
        const data = await res.json();

        if (res.ok && data.survey) {
          const s = data.survey;
          setTitle(s.title);
          setDescription(s.description || "");
          setExpiresAt(s.expiresAt ? new Date(s.expiresAt).toISOString().slice(0, 16) : "");
          
          const formattedQuestions = (s.questions || []).map((q: any) => ({
            id: q.id,
            type: q.type,
            text: q.text,
            required: q.required,
            options: q.options || [],
            imageUrl: q.imageUrl || "",
            maxRating: q.maxRating || 5,
          }));
          setQuestions(formattedQuestions);
        } else {
          alert(data.error || "Failed to load survey.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while loading the survey.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId, router]);

  const handleSaveSurvey = async (isPublished = false) => {
    if (!title.trim()) {
      alert("Please enter a survey title.");
      return;
    }

    if (!expiresAt) {
      alert("Please specify an expiration date and time.");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question to your survey.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          expiresAt: new Date(expiresAt).toISOString(), 
          questions,
          published: isPublished 
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update survey.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestionTemplate = (type: BuilderQuestion["type"]) => {
    const newQuestion: BuilderQuestion = {
      id: crypto.randomUUID(),
      type,
      text: "",
      required: false,
      options: type === "MULTIPLE_CHOICE" || type === "CHECKBOX" || type === "IMAGE_CHOICE" ? ["Option 1"] : [],
      imageUrl: type === "IMAGE_CHOICE" ? "" : undefined,
      maxRating: type === "RATING" ? 5 : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<BuilderQuestion>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
        }
        return q;
      })
    );
  };

  const updateOptionText = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = [...q.options];
          updatedOptions[index] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const removeOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, options: q.options.filter((_, i) => i !== index) };
        }
        return q;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-sm font-medium">Loading survey draft...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Builder Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h1 className="text-sm font-bold tracking-wider text-sky-400 uppercase">Editing Survey Draft</h1>
          </div>

          <SurveyMetaEditor
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            expiresAt={expiresAt}
            setExpiresAt={setExpiresAt}
          />

          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={index}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
              onAddOption={addOption}
              onUpdateOption={updateOptionText}
              onRemoveOption={removeOption}
            />
          ))}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => handleSaveSurvey(false)}
              disabled={isSubmitting}
              className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              Save Changes
            </button>
            
            <button
              onClick={() => handleSaveSurvey(true)}
              disabled={isSubmitting}
              className="flex-1 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "Updating..." : "Publish Survey"}
            </button>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="space-y-4">
          <QuestionPalette onAddQuestion={addQuestionTemplate} />
        </div>

      </div>
    </div>
  );
}