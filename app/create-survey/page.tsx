"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import QuestionCard from "../components/builder/QuestionCard";
import SurveyMetaEditor from "../components/builder/SurveyMetaEditor";
import QuestionPalette from "../components/builder/QuestionPalette";

interface BuilderQuestion {
  id: string;
  type: "MULTIPLE_CHOICE" | "CHECKBOX" | "TEXT" | "RATING" | "IMAGE_CHOICE";
  text: string;
  required: boolean;
  options: string[];
  imageUrl?: string;
  maxRating?: number;
}

const getDefaultExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 16);
};

export default function NewSurveyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiry());
  const [questions, setQuestions] = useState<BuilderQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSaveSurvey = async () => {
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
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          expiresAt: new Date(expiresAt).toISOString(), 
          questions 
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to create survey.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Builder Area */}
        <div className="lg:col-span-2 space-y-6">
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

          <button
            onClick={handleSaveSurvey}
            disabled={isSubmitting}
            className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Saving Survey..." : "Publish Survey"}
          </button>
        </div>

        {/* Sidebar Question Palette */}
        <div className="space-y-4">
          <QuestionPalette onAddQuestion={addQuestionTemplate} />
        </div>

      </div>
    </div>
  );
}