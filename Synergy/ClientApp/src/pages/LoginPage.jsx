import { useState } from "react";
import { Logo } from "../components/ui/Logo";
import { Mail, Lock, User } from "lucide-react";

export function AuthPage({ mode, onSubmit, onToggleMode, onBack, error }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, special: false, number: false, capital: false
    });


    const validateName = (name) => name && name.trim().length >= 4;
    const validateEmail = (email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (pwd) => {
        if (!pwd) return false;
        const length = pwd.length >= 8;
        const special = (pwd.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 1;
        const number = /\d/.test(pwd);
        const capital = /[A-Z]/.test(pwd);
        setPasswordCriteria({ length, special, number, capital });
        return length && special && number && capital;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNameValid(true);
        setEmailValid(true);

        const emailOk = validateEmail(email);

        if (mode === "login") {
            if (!emailOk || !password.trim()) {
                if (!emailOk) setEmailValid(false);
                setIsSubmitting(false);
                return;
            }

            try {
                await onSubmit(email, password);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        const nameOk = validateName(name);
        const passOk = validatePassword(password);

        if (!nameOk) setNameValid(false);
        if (!emailOk) setEmailValid(false);

        if (!nameOk || !emailOk || !passOk) {
            setIsSubmitting(false);
            return;
        }

        try {
            await onSubmit(email, password, name);
        } finally {
            setIsSubmitting(false);
        }
    };



    



    return (
        <div className="min-h-screen bg-gradient-to-br from-synergy-bg-dark via-synergy-black to-synergy-charcoal flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <Logo size="lg" />
                    </div>

                    <h2 className="text-3xl text-white mb-2 font-bold">
                        {mode === "login" ? "Welcome Back" : "Get Started"}
                    </h2>

                    <p className="text-synergy-light-gray">
                        {mode === "login"
                            ? "Log in to access your team dashboard"
                            : "Create an account to start collaborating"}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-synergy-charcoal border border-synergy-dark-gray rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 rounded-lg text-sm text-synergy-red bg-synergy-red/10 border border-synergy-red/30">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode !== "login" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="your username"
                                        className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition ${nameValid
                                                ? "border-white/10 focus:border-emerald-400"
                                                : "border-red-400 focus:border-red-400"
                                            }`}
                                    />
                                </div>
                                {!nameValid && (
                                    <p className="text-xs text-red-400">
                                        Username must be at least 4 characters.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@university.edu"
                                    className={`w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition ${emailValid
                                            ? "border-white/10 focus:border-emerald-400"
                                            : "border-red-400 focus:border-red-400"
                                        }`}
                                />
                            </div>
                            {!emailValid && (
                                <p className="text-xs text-red-400">Please enter a valid email address.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (mode !== "login") {
                                            validatePassword(e.target.value);
                                        }
                                    }}
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition focus:border-emerald-400"
                                />
                            </div>

                            {mode !== "login" && (
                                <div className="space-y-1 pt-1 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={passwordCriteria.length} readOnly />
                                        <span>8+ characters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={passwordCriteria.special} readOnly />
                                        <span>1+ special char</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={passwordCriteria.number} readOnly />
                                        <span>1+ number</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={passwordCriteria.capital} readOnly />
                                        <span>1+ capital letter</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && <p className="text-sm text-red-400">{error}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                            {isSubmitting ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={onToggleMode}
                            className="text-synergy-light-gray hover:text-primary transition-all text-sm"
                        >
                            {mode === "login"
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Log in"}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={onBack}
                            className="text-synergy-light-gray hover:text-white transition-all text-sm"
                        >
                            ← Back to home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}