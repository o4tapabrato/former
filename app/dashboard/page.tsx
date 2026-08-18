import Link from "next/link";
import { db } from "@/lib/prisma";
import { PlusCircle, Image as ImageIcon, Star, ListOrdered, FileText, GraduationCap } from "lucide-react";

export default async function DashboardPage() {
    // Fetch existing surveys for this user if needed
    // const surveys = await db.survey.findMany({ ... });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
                        <p className="text-slate-400">Create, manage, and design rich multi-type surveys.</p>
                    </div>
                    <Link
                        href="/survey/new"
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 rounded-2xl font-semibold transition shadow-lg shadow-sky-600/20"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Blank Survey
                    </Link>
                </div>

                {/* Survey Creation Options Grid */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-200">Start a New Survey</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Option 1: Standard Multi-Choice / Mixed Survey */}
                        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                    <ListOrdered className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Standard Survey</h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Build custom surveys mixing multiple-choice, text inputs, checkboxes, and drop-downs.
                                </p>
                            </div>
                            <Link
                                href="/survey/new?type=standard"
                                className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Get Started &rarr;
                            </Link>
                        </div>

                        {/* Option 2: Visual / Image-Based Survey */}
                        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Visual & Media Survey</h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Include high-resolution diagrams, product mockups, or photos directly inside your questions.
                                </p>
                            </div>
                            <Link
                                href="/survey/new?type=visual"
                                className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-sky-300"
                            >
                                Get Started &rarr;
                            </Link>
                        </div>

                        {/* Option 3: Rating & Feedback Survey */}
                        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                    <Star className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Rating & Feedback</h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    Gather precise star ratings, scale preferences, and qualitative reviews from your target audience.
                                </p>
                            </div>
                            <Link
                                href="/survey/new?type=rating"
                                className="inline-flex items-center text-sm font-semibold text-amber-400 hover:text-amber-300"
                            >
                                Get Started &rarr;
                            </Link>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Timed Online Test / Quiz</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Build graded exams with point values, correct answer keys, automatic scoring, and countdown timers.
                        </p>
                    </div>
                    <Link
                        href="/survey/new?mode=quiz"
                        className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                        Create Test &rarr;
                    </Link>
                </div>

                    </div>
                </div>
                

                {/* Recent Surveys Section */}
                <div className="space-y-4 pt-6">
                    <h2 className="text-xl font-bold tracking-tight text-slate-200">Your Recent Surveys</h2>
                    <div className="p-8 rounded-3xl bg-slate-950 border border-slate-900 text-center text-slate-500">
                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>You haven't created any surveys yet. Click an option above to build your first one!</p>
                    </div>
                </div>

            </div>
        </div>
    );
}