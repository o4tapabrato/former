interface CheckboxInputProps {
  question: any;
  answer: any;
  onChange: (questionId: string, value: any, type: string) => void;
}

export default function CheckboxInput({ question: q, answer, onChange }: CheckboxInputProps) {
  return (
    <div className="space-y-2.5 pt-2">
      {q.options.map((opt: string, optIdx: number) => {
        const isChecked = (answer || []).includes(opt);
        return (
          <label 
            key={optIdx} 
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
          >
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={() => onChange(q.id, opt, q.type)}
              className="rounded text-sky-500 focus:ring-0 bg-slate-950 border-slate-700"
            />
            <span className="text-sm text-slate-200">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}