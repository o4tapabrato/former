import MultipleChoiceInput from "./questions/MultipleChoiceInput";
import CheckboxInput from "./questions/CheckboxInput";
import TextInput from "./questions/TextInput";
import RatingInput from "./questions/RatingInput";
import ImageChoiceInput from "./questions/ImageChoiceInput";

interface QuestionRendererProps {
  question: any;
  index: number;
  answer: any;
  onChange: (questionId: string, value: any, type: string) => void;
}

export default function QuestionRenderer({ question: q, index, answer, onChange }: QuestionRendererProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-white">
          <span className="text-sky-400 mr-2">Q{index + 1}.</span>
          {q.text}
          {q.required && <span className="text-rose-400 ml-1">*</span>}
        </h3>
      </div>

      {/* Render input components based on type */}
      {q.type === "MULTIPLE_CHOICE" && (
        <MultipleChoiceInput question={q} answer={answer} onChange={onChange} />
      )}

      {q.type === "CHECKBOX" && (
        <CheckboxInput question={q} answer={answer} onChange={onChange} />
      )}

      {q.type === "TEXT" && (
        <TextInput question={q} answer={answer} onChange={onChange} />
      )}

      {q.type === "RATING" && (
        <RatingInput question={q} answer={answer} onChange={onChange} />
      )}

      {q.type === "IMAGE_CHOICE" && (
        <ImageChoiceInput question={q} answer={answer} onChange={onChange} />
      )}
    </div>
  );
}