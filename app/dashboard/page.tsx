'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LayoutGrid, LogOut, ShieldCheck, Mail, Calendar, UserCheck } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch("/api/dashboard");
                
                if (!response.ok) {
                    router.push('/login');
                    return;
                }

                const data = await response.json();
                console.log(data);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <p className="text-slate-400 animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-sky-500 selection:text-white">
            {/* Header / Navbar */}
            <header className="w-full max-w-7xl mx-auto px-6 h-24 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg shadow-sky-600/30">
                        <LayoutGrid className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Survey<span className="text-sky-400">Craft</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Active Session</span>
                    </div>
                    <form action="/api/auth/signout" method="GET">
                        <button 
                            type="submit"
                            className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl backdrop-blur-md"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </header>

            {/* Main Content Dashboard */}
            <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Dashboard</h1>
                    <p className="text-slate-400 text-sm">Welcome back! Here are your account profile details.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-10">
                    <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Username</p>
                            <p className="text-lg font-bold text-white">{user.username}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-slate-400 font-medium">Email Address</p>
                            <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Account Status</p>
                            <p className="text-lg font-bold text-emerald-400">Verified</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-sky-400" />
                        <span>Profile Information</span>
                    </h3>

                    <div className="divide-y divide-slate-800/80 text-sm">
                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-400">User ID</span>
                            <span className="font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">{user.id}</span>
                        </div>
                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-400">Username</span>
                            <span className="font-medium text-white">{user.username}</span>
                        </div>
                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-400">Email</span>
                            <span className="font-medium text-white">{user.email}</span>
                        </div>
                        <div className="py-4 flex justify-between items-center">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" /> Member Since
                            </span>
                            <span className="font-medium text-white">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800/40">
                &copy; 2026 SurveyCraft. All rights reserved.
            </footer>
        </div>
    );
}