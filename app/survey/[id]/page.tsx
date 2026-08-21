import { notFound } from "next/navigation";
import SurveyTakerForm from "@/app/components/survey/SurveyTakerForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SurveyTakerPage({ params }: PageProps) {
  const { id } = params;

  // Fetch survey and its related questions using Prisma's one-way relation
  const survey = await db.survey.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Survey Header Banner */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 shadow-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{survey.title}</h1>
          {survey.description && (
            <p className="text-slate-400 text-sm leading-relaxed">{survey.description}</p>
          )}
        </div>

        {/* Interactive Response Form */}
        <SurveyTakerForm survey={survey} />

      </div>
    </div>
  );
}