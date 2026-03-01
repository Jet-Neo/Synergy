import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Clock, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[120px]" />
            </div>

            <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        <svg width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-400">
                            <path d="M2 22h20" />
                            <path d="M12 2v20" />
                            <path d="M12 2l-8 8" />
                            <path d="M12 2l8 8" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Synergy
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="ghost" className="text-gray-300 hover:text-white">
                            Log In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="primary" className="shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                            Get Started <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-800/50 text-green-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Burnout Prevention Engine v1.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        Smarter Team Productivity. <br />
                        <span className="text-green-500">Healthier Workflows.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop burnout before it starts. Synergy helps student teams track workload, manage tasks, and maintain balance with AI-driven analytics.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="h-12 px-8 text-lg shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all">
                                Start for Free
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-gray-700 hover:border-gray-500">
                                View Demo
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {[
                        {
                            icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
                            title: "Task Management",
                            desc: "Organize projects with deadlines, priorities, and smart assignments."
                        },
                        {
                            icon: <Clock className="w-6 h-6 text-green-400" />,
                            title: "Work Log Tracking",
                            desc: "Effortlessly log hours to visualize team contributions and effort."
                        },
                        {
                            icon: <TrendingUp className="w-6 h-6 text-green-400" />,
                            title: "Team Analytics",
                            desc: "Gain insights into productivity trends and project velocity."
                        },
                        {
                            icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
                            title: "Burnout Detection",
                            desc: "Smart indicators warn you when workload exceeds healthy limits."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group p-6 rounded-2xl bg-gray-900/40 border border-white/5 hover:border-green-500/30 transition-all hover:bg-gray-900/60 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-green-500/20">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="border-t border-white/5 bg-black py-12 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Synergy. Built for the future of work.
                    </p>
                </div>
            </footer>
        </div>
    );
}
