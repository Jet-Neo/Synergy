export function LoginPage({ onBack }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="bg-zinc-900 p-8 rounded-xl w-96">

                <h1 className="text-3xl font-bold text-center mb-4">
                    Synergy
                </h1>

                <p className="text-gray-400 text-center mb-6">
                    Log in to access your team dashboard
                </p>

                <input
                    type="email"
                    placeholder="you@university.edu"
                    className="w-full mb-3 p-3 rounded bg-zinc-800"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 p-3 rounded bg-zinc-800"
                />

                <button className="w-full bg-green-500 p-3 rounded font-bold">
                    Log In
                </button>

                <button
                    className="mt-4 text-sm text-gray-400 underline"
                    onClick={onBack}
                >
                    Back
                </button>

            </div>
        </div>
    );
}