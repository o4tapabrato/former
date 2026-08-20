interface Props {
  question: any;
  onUpdate: (updates: any) => void;
  onAddOption: () => void;
  onUpdateOption: (index: number, val: string) => void;
  onRemoveOption: (index: number) => void;
}

export default function MultipleChoiceEditor({ question, onUpdate, onAddOption, onUpdateOption, onRemoveOption }: Props) {
  return (
    <div className="space-y-2 pl-2">
      <label className="text-xs text-slate-400 font-medium">Options:</label>
      {question.options.map((opt: string, optIndex: number) => (
        <div key={optIndex} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-slate-600" />
          <input 
            type="text" 
            value={opt}
            onChange={(e) => onUpdateOption(optIndex, e.target.value)}
            className="flex-1 bg-slate-950/30 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
          />
          {question.options.length > 1 && (
            <button onClick={() => onRemoveOption(optIndex)} className="text-slate-600 hover:text-rose-400 text-xs">×</button>
          )}
        </div>
      ))}
      <button 
        onClick={onAddOption}
        className="text-xs text-sky-400 hover:text-sky-300 font-medium mt-1 inline-flex items-center gap-1"
      >
        + Add Option
      </button>
    </div>
  );
}