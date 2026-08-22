interface MultipleChoiceInputProps {
  question: any;
  answer: any;
  onChange: (questionId: string, value: any, type: string) => void;
}

export default function MultipleChoiceInput({ question: q, answer, onChange }: MultipleChoiceInputProps) {
  return (
    <div className="space-y-2.5 pt-2">
      {q.options.map((opt: string, optIdx: number) => (
        <label 
          key={optIdx} 
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
        >
          <input 
            type="radio" 
            name={q.id}
            checked={answer === opt}
            onChange={() => onChange(q.id, opt, q.type)}
            className="text-sky-500 focus:ring-0 bg-slate-950 border-slate-700"
          />
          <span className="text-sm text-slate-200">{opt}</span>
        </label>
      ))}
    </div>
  );
}