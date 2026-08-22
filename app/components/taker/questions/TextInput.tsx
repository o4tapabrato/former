interface TextInputProps {
  question: any;
  answer: any;
  onChange: (questionId: string, value: any, type: string) => void;
}

export default function TextInput({ question: q, answer, onChange }: TextInputProps) {
  const MAX_LIMIT = 5000;
  const currentLength = (answer || "").length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LIMIT) {
      onChange(q.id, value, q.type);
    }
  };

  return (
    <div className="space-y-1.5">
      <textarea 
        rows={4}
        value={answer || ""}
        onChange={handleChange}
        placeholder="Type your response here (max 5,000 characters)..."
        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 resize-none mt-2"
      />
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-slate-500">Supports up to 5,000 characters</span>
        <span className={`font-semibold ${currentLength >= MAX_LIMIT ? "text-rose-400" : "text-slate-500"}`}>
          {currentLength.toLocaleString()} / {MAX_LIMIT.toLocaleString()}
        </span>
      </div>
    </div>
  );
}