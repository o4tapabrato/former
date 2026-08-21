"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ListOrdered, 
  CheckSquare, 
  AlignLeft, 
  Star, 
  Image as ImageIcon, 
  Plus, 
  Save,
  Calendar
} from "lucide-react";
import QuestionCard from "../components/builder/QuestionCard";

interface BuilderQuestion {
  id: string;
  type: "MULTIPLE_CHOICE" | "CHECKBOX" | "TEXT" | "RATING" | "IMAGE_CHOICE";
  text: string;
  required: boolean;
  options: string[];
  imageUrl?: string;
  maxRating?: number;
}

export default function NewSurveyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState(""); // <-- Added state for expiration
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
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
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

            {/* Expiration Date Picker Section */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" />
                Expiration Date & Time (Optional)
              </label>
              <input 
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500">If set, respondents will not be able to submit answers after this deadline.</p>
            </div>
          </div>

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
          <div className="sticky top-24 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight">Question Types</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => addQuestionTemplate("MULTIPLE_CHOICE")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
              >
                <ListOrdered className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-semibold text-white">Multiple Choice</span>
              </button>
              <button
                onClick={() => addQuestionTemplate("CHECKBOX")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
              >
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Checkboxes</span>
              </button>
              <button
                onClick={() => addQuestionTemplate("TEXT")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
              >
                <AlignLeft className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">Open Text</span>
              </button>
              <button
                onClick={() => addQuestionTemplate("RATING")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Rating Scale</span>
              </button>
              <button
                onClick={() => addQuestionTemplate("IMAGE_CHOICE")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 text-left transition"
              >
                <ImageIcon className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-semibold text-white">Visual Choice</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}