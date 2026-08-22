interface ImageChoiceInputProps {
  question: any;
  answer: any;
  onChange: (questionId: string, value: any, type: string) => void;
}

export default function ImageChoiceInput({ question: q, answer, onChange }: ImageChoiceInputProps) {
  return (
    <div className="space-y-4 pt-2">
      {q.imageUrl && (
        <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <img src={q.imageUrl} alt="Survey visual prompt" className="w-full h-full object-cover" />
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
              checked={answer === opt}
              onChange={() => onChange(q.id, opt, q.type)}
              className="text-sky-500 focus:ring-0 bg-slate-950 border-slate-700"
            />
            <span className="text-sm text-slate-200">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}