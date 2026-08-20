export default function RatingEditor() {
  return (
    <div className="flex items-center gap-2 pt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="w-8 h-8 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
          {star}
        </div>
      ))}
    </div>
  );
}