"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import SuccessMessage from "../taker/SuccessMessage";
import QuestionRenderer from "../taker/QuestionRenderer";

interface SurveyTakerFormProps {
  surveyId: string;
  questions: any[];
}

export default function SurveyTakerForm({ surveyId, questions }: SurveyTakerFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    for (const q of questions) {
      if (q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0))) {
        alert(`Please answer the required question: "${q.text}"`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/surveys/responses/${surveyId}`, {
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
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q, index) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          index={index}
          answer={answers[q.id]}
          onChange={handleAnswerChange}
        />
      ))}

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