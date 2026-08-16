'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { LayoutGrid, Code2, CheckCheck, BarChartBig, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic Particle Effect Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Configuration
    const particleCount = Math.floor((width * height) / 15000);
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with lines
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.lineWidth = 1 - dist / 120;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white relative overflow-hidden">
      
      {/* Interactive Particle Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/80">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg shadow-sky-600/30">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Survey<span className="text-sky-400">Craft</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#types" className="hover:text-white transition-colors">Question Types</a>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </Link>
            <Link 
              href="/signup" 
              className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-sky-600/30 hover:scale-105 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-40 pb-24 relative z-10">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 rounded-full text-sky-400 text-xs font-semibold mb-6 shadow-inner">
            <Code2 className="w-4 h-4" />
            <span>Next.js & TypeScript Powered Architecture</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Build Intelligent Surveys with <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Strict Type Safety</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A robust platform built for creators. Define complex polymorphic question structures, automate test grading, and analyze results with TypeScript-first precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-sky-600/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/login" 
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Sign In to Account</span>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto mt-36 px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all hover:-translate-y-1 shadow-xl">
            <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6 border border-sky-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">TypeScript-First</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Polymorphic question models ensure every survey payload is perfectly typed from input forms to your database.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all hover:-translate-y-1 shadow-xl">
            <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6 border border-sky-500/20">
              <CheckCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Automated Grading</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transform surveys into rigorous tests with instant scoring and validation against correct answer keys.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all hover:-translate-y-1 shadow-xl">
            <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6 border border-sky-500/20">
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
      <footer className="border-t border-slate-800/80 py-12 text-center text-slate-500 text-sm relative z-10 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-300">SurveyCraft</span>
          <p>&copy; 2026 SurveyCraft. Built with Next.js and TypeScript.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-slate-400 transition-colors">Log In</Link>
            <Link href="/signup" className="hover:text-slate-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}