"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";

interface SurveyTakerFormProps {
  survey: any;
}

export default function SurveyTakerForm({ survey }: SurveyTakerFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes dynamically based on question type
  const handleAnswerChange = (questionId: string, value: any, type: string) => {
    if (type === "CHECKBOX") {
      const currentSelection = answers[questionId] || [];
      if (currentSelection.includes(value)) {
        setAnswers({
          ...answers,
          [questionId]: currentSelection.filter((item: string) => item !== value),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentSelection, value],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required questions
    for (const q of survey.questions) {
      if (q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0))) {
        alert(`Please answer the required question: "${q.text}"`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/surveys/${survey.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit survey. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Thank you!</h2>
        <p className="text-slate-400 text-sm">Your response has been successfully recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {survey.questions.map((q: any, index: number) => (
        <div key={q.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          
          {/* Question Title & Required Tag */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base font-semibold text-white">
              <span className="text-sky-400 mr-2">Q{index + 1}.</span>
              {q.text}
              {q.required && <span className="text-rose-400 ml-1">*</span>}
            </h3>
          </div>

          {/* Conditional Input Rendering */}
          
          {/* 1. Multiple Choice */}
          {q.type === "MULTIPLE_CHOICE" && (
            <div className="space-y-2.5 pt-2">
              {q.options.map((opt: string, optIdx: number) => (
                <label 
                  key={optIdx} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
                >
                  <input 
                    type="radio" 
                    name={q.id}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswerChange(q.id, opt, q.type)}
                    className="text-sky-500 focus:ring-0 bg-slate-950 border-slate-700"
                  />
                  <span className="text-sm text-slate-200">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {/* 2. Checkboxes */}
          {q.type === "CHECKBOX" && (
            <div className="space-y-2.5 pt-2">
              {q.options.map((opt: string, optIdx: number) => {
                const isChecked = (answers[q.id] || []).includes(opt);
                return (
                  <label 
                    key={optIdx} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
                  >
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => handleAnswerChange(q.id, opt, q.type)}
                      className="rounded text-sky-500 focus:ring-0 bg-slate-950 border-slate-700"
                    />
                    <span className="text-sm text-slate-200">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* 3. Open Text */}
          {q.type === "TEXT" && (
            <textarea 
              rows={3}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value, q.type)}
              placeholder="Type your response here..."
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          )}

          {/* 4. Rating Scale */}
          {q.type === "RATING" && (
            <div className="flex items-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = answers[q.id] === star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleAnswerChange(q.id, star, q.type)}
                    className={`w-10 h-10 rounded-xl border text-sm font-bold transition flex items-center justify-center ${
                      isSelected 
                        ? "bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-600/20" 
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {star}
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. Visual Choice */}
          {q.type === "IMAGE_CHOICE" && (
            <div className="space-y-4">
              {q.imageUrl && (
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={q.imageUrl} alt="Survey Question visual" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-2.5">
                {q.options.map((opt: string, optIdx: number) => (
                  <label 
                    key={optIdx} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
                  >
                    <input 
                      type="radio" 
                      name={q.id}
                      checked={answers[q.id] === opt}
                      onChange={() => handleAnswerChange(q.id, opt, q.type)}
                      className="text-sky-500 focus:ring-0 bg-slate-950 border-slate-700"
                    />
                    <span className="text-sm text-slate-200">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? "Submitting Response..." : "Submit Response"}
      </button>
    </form>
  );
}