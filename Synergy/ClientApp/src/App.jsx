import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/LoginPage";

function App() {
    const [currentPage, setCurrentPage] = useState("landing");
    const [authMode, setAuthMode] = useState("login");
    const [error, setError] = useState(null);

    const handleOpenLogin = () => {
        setAuthMode("login");
        setError(null);
        setCurrentPage("auth");
    };

    const handleOpenSignup = () => {
        setAuthMode("signup");
        setError(null);
        setCurrentPage("auth");
    };

    const handleToggleMode = () => {
        setError(null);
        setAuthMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
    };

    const handleBackToHome = () => {
        setError(null);
        setCurrentPage("landing");
    };

    const handleAuthSubmit = async (email, password, name) => {
        try {
            console.log("Auth submitted:", {
                mode: authMode,
                email,
                password,
                name,
            });

            // later you can replace this with real backend auth
            setError(null);

            // temporary success behavior
            alert(`${authMode === "login" ? "Logged in" : "Account created"} successfully!`);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    if (currentPage === "auth") {
        return (
            <AuthPage
                mode={authMode}
                onSubmit={handleAuthSubmit}
                onToggleMode={handleToggleMode}
                onBack={handleBackToHome}
                error={error}
            />
        );
    }

    return (
        <LandingPage
            onGetStarted={handleOpenSignup}
            onLogin={handleOpenLogin}
        />
    );
}

export default App;