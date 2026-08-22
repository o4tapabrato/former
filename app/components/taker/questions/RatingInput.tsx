interface RatingInputProps {
  question: any;
  answer: any;
  onChange: (questionId: string, value: any, type: string) => void;
}

export default function RatingInput({ question: q, answer, onChange }: RatingInputProps) {
  return (
    <div className="flex items-center gap-2 pt-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isSelected = answer === star;
        return (
          <button
            type="button"
            key={star}
            onClick={() => onChange(q.id, star, q.type)}
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
  );
}