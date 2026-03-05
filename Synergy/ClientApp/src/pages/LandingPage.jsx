import { CheckSquare, Clock, BarChart3, AlertTriangle, ArrowRight } from "lucide-react";
import { Logo } from "../components/ui/Logo";

export function LandingPage({ onGetStarted, onLogin }) {
    const features = [
        {
            icon: CheckSquare,
            title: "Task Management",
            description: "Organize your team projects with intuitive task tracking and assignment.",
        },
        {
            icon: Clock,
            title: "Work Log Tracking",
            description: "Monitor time spent on tasks and identify workload patterns.",
        },
        {
            icon: BarChart3,
            title: "Team Analytics",
            description: "Visualize productivity metrics and team performance insights.",
        },
        {
            icon: AlertTriangle,
            title: "Burnout Detection",
            description: "AI-powered alerts to prevent overwork and maintain balance.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-synergy-bg-dark via-synergy-black to-synergy-charcoal">
            {/* Navigation */}
            <nav className="border-b border-synergy-charcoal backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo size="md" />

                    <button
                        onClick={onLogin}
                        className="px-6 py-2.5 rounded-lg border border-primary text-primary
                       hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    {/* ? pill with green fill like Figma */}
                    <div className="inline-flex items-center justify-center">
                        <div className="px-4 py-2 rounded-full text-sm text-primary
                  bg-primary/10 border border-primary/30">
                            Built for College Teams
                        </div>
                    </div>

                    <h1 className="text-6xl text-white leading-tight font-extrabold">
                        Smarter Team Productivity.
                        <br />
                        <span className="text-primary">Healthier Workflows.</span>
                    </h1>

                    <p className="text-xl text-synergy-light-gray max-w-2xl mx-auto leading-relaxed">
                        Track workload, prevent burnout, and optimize team collaboration with intelligent analytics designed for student teams.
                    </p>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={onGetStarted}
                            className="px-8 py-4 bg-primary text-white rounded-lg
             shadow-glow-sm hover:shadow-glow-md
             transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </button>

                        <button
                            onClick={onLogin}
                            className="px-8 py-4 bg-synergy-charcoal hover:bg-synergy-dark-gray text-white rounded-lg
                         transition-all duration-300 font-semibold"
                        >
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="group rounded-2xl p-8 overflow-hidden
             bg-synergy-charcoal/50 border border-synergy-dark-gray/60 backdrop-blur-sm
             transition-all duration-300
             hover:border-primary/40 hover:bg-synergy-charcoal/70 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6
                bg-primary/10 transition-all duration-300
                group-hover:bg-primary/20 group-hover:scale-110">

                                    <Icon className="text-primary" size={24} />
                                </div>

                                <h3 className="text-white text-xl mb-3 font-semibold">
                                    {feature.title}
                                </h3>

                                <p className="text-synergy-light-gray leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-synergy-charcoal py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-synergy-light-gray text-sm">
                    © 2026 Synergy. Built for student teams, by student teams.
                </div>
            </footer>
        </div>
    );
}