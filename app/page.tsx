import Link from 'next/link';
import { LayoutGrid, Code2, CheckCheck, BarChartBig, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-600 shadow-lg shadow-sky-600/30">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Survey<span className="text-sky-500">Craft</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#types" className="hover:text-white transition-colors">Question Types</a>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/builder" 
              className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-sky-600/30 hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-24">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-full text-sky-400 text-xs font-semibold mb-6">
            <Code2 className="w-4 h-4" />
            <span>Built for Next.js & TypeScript</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Build Intelligent Surveys with <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">Strict Type Safety</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A robust platform built for creators. Define complex polymorphic question structures, automate test grading, and analyze results with TypeScript-first precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/builder" 
              className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-sky-600/20 flex items-center justify-center gap-2"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto mt-32 px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-colors">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">TypeScript-First</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Polymorphic question models ensure every survey payload is perfectly typed from input forms to your database.
            </p>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-colors">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6">
              <CheckCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Automated Grading</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transform surveys into rigorous tests with instant scoring and validation against correct answer keys.
            </p>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-colors">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6">
              <BarChartBig className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Deep Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Structured data storage allows for rapid aggregation and insightful performance visualizations.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-300">SurveyCraft</span>
          <p>&copy; 2026 SurveyCraft. Built with Next.js and TypeScript.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy</a>
            <a href="#" className="hover:text-slate-400">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}