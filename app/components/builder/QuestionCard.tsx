import { Trash2 } from "lucide-react";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import RatingEditor from "./RatingEditor";

interface Props {
  question: any;
  index: number;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
  onAddOption: (id: string) => void;
  onUpdateOption: (id: string, index: number, val: string) => void;
  onRemoveOption: (id: string, index: number) => void;
}

export default function QuestionCard({
  question,
  index,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: Props) {
  
  const renderEditorContent = () => {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
      case "CHECKBOX":
      case "IMAGE_CHOICE":
        return (
          <MultipleChoiceEditor
            question={question}
            onUpdate={(updates) => onUpdate(question.id, updates)}
            onAddOption={() => onAddOption(question.id)}
            onUpdateOption={(optIdx, val) => onUpdateOption(question.id, optIdx, val)}
            onRemoveOption={(optIdx) => onRemoveOption(question.id, optIdx)}
          />
        );
      case "TEXT":
        return (
          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/60 text-xs text-slate-500 italic">
            Respondent will see a long-form text box here.
          </div>
        );
      case "RATING":
        return <RatingEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 relative group">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Q{index + 1} • {question.type.replace("_", " ")}
        </span>
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 flex items-center gap-1 cursor-pointer">
            <input 
              type="checkbox" 
              checked={question.required} 
              onChange={(e) => onUpdate(question.id, { required: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0"
            />
            Required
          </label>
          <button 
            onClick={() => onRemove(question.id)}
            className="text-slate-500 hover:text-rose-400 transition p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Text Input */}
      <input 
        type="text" 
        value={question.text}
        onChange={(e) => onUpdate(question.id, { text: e.target.value })}
        placeholder="Type your question here..."
        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 text-sm"
      />

      {/* Image URL input if Image Choice */}
      {question.type === "IMAGE_CHOICE" && (
        <input 
          type="text" 
          value={question.imageUrl || ""}
          onChange={(e) => onUpdate(question.id, { imageUrl: e.target.value })}
          placeholder="Paste image URL here..."
          className="w-full bg-slate-950/30 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
        />
      )}

      {/* Dynamic Sub-Component Editor */}
      {renderEditorContent()}

    </div>
  );
}