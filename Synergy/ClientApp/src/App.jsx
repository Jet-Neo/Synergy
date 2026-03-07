import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

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
        setAuthMode((prevMode) =>
            prevMode === "login" ? "signup" : "login"
        );
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

            setError(null);

            // simulate successful login
            alert(
                `${authMode === "login" ? "Logged in" : "Account created"} successfully!`
            );

            // go to dashboard after login/signup
            setCurrentPage("dashboard");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    // AUTH PAGE
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

    // DASHBOARD PAGE
    if (currentPage === "dashboard") {
        return <DashboardPage />;
    }

    // LANDING PAGE (default)
    return (
        <LandingPage
            onGetStarted={handleOpenSignup}
            onLogin={handleOpenLogin}
        />
    );
}

export default App;