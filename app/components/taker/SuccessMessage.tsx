import { CheckCircle2 } from "lucide-react";

export default function SuccessMessage() {
  return (
    <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-xl">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white">Thank you!</h2>
      <p className="text-slate-400 text-sm">Your response has been successfully recorded.</p>
    </div>
  );
}