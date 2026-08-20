"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ListOrdered, 
  CheckSquare, 
  AlignLeft, 
  Star, 
  Image as ImageIcon, 
  Save,
  BookmarkPlus
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

export default function SurveyBuilderPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Untitled Survey");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<BuilderQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Track unsaved modifications
  useEffect(() => {
    setIsDirty(true);
  }, [title, description, questions]);

  // Browser close / tab refresh warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Add question template based on type
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

  const handleSaveSurvey = async (isDraft = false) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, questions, isDraft }),
      });

      if (response.ok) {
        setIsDirty(false);
        router.push("/dashboard");
      } else {
        alert("Failed to save survey");
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
        
        {/* SECTION 1: Questions List & Live Preview */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
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
          </div>

          {questions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 text-slate-500">
              <p>No questions added yet. Select a question type from the options panel to begin building.</p>
            </div>
          ) : (
            questions.map((q, index) => (
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
            ))
          )}

          {questions.length > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSaveSurvey(true)}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <BookmarkPlus className="w-5 h-5 text-slate-400" />
                Save as Draft
              </button>

              <button
                onClick={() => handleSaveSurvey(false)}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? "Saving..." : "Publish Survey"}
              </button>
            </div>
          )}

        </div>

        {/* SECTION 2: Question Type Palette Sidebar */}
        <div className="space-y-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Question Types</h3>
            <p className="text-xs text-slate-400">Click any option to append a template to your survey.</p>

            <div className="space-y-2.5">
              <button
                onClick={() => addQuestionTemplate("MULTIPLE_CHOICE")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Multiple Choice</p>
                  <p className="text-xs text-slate-400">Select one option from a list</p>
                </div>
              </button>

              <button
                onClick={() => addQuestionTemplate("CHECKBOX")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Checkboxes</p>
                  <p className="text-xs text-slate-400">Select multiple choices</p>
                </div>
              </button>

              <button
                onClick={() => addQuestionTemplate("TEXT")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Open Text</p>
                  <p className="text-xs text-slate-400">Short or long qualitative response</p>
                </div>
              </button>

              <button
                onClick={() => addQuestionTemplate("RATING")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center group-hover:scale-105 transition">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Rating Scale</p>
                  <p className="text-xs text-slate-400">Numerical or star scale rating</p>
                </div>
              </button>

              <button
                onClick={() => addQuestionTemplate("IMAGE_CHOICE")}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-105 transition">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Visual Choice</p>
                  <p className="text-xs text-slate-400">Question accompanied by an image</p>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}