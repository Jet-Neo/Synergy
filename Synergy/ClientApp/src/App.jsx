import { useState, useEffect } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/LoginPage";
import { Sidebar } from "./pages/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import WorkLogsPage from "./pages/WorkLogsPage";
import { auth } from "./services/api";
import AnalyticsPage from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import  TeamsPage  from "./pages/TeamsPage";

export default function App() {
    const [view, setView] = useState("loading");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const runSessionCheck = async () => {
            try {
                const session = await auth.getSession();

                if (!isMounted) return;

                if (session) {
                    setView("dashboard");
                } else {
                    setView("landing");
                }
            } catch (err) {
                console.error("Session check error:", err);

                if (isMounted) {
                    setView("landing");
                }
            }
        };

        runSessionCheck();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleGetStarted = () => {
        setView("signup");
        setError(null);
    };

    const handleLogin = () => {
        setView("login");
        setError(null);
    };

    const handleAuth = async (email, password, name) => {
        try {
            setError(null);

            if (view === "signup") {
                await auth.signup(email, password, name);
            } else {
                await auth.login(email, password);
            }

            setView("dashboard");
            setActiveTab("dashboard");
        } catch (err) {
            console.error("Auth error:", err);
            setError("Authentication failed. Try again.");
        }
    };

    const handleToggleAuthMode = () => {
        setView(view === "login" ? "signup" : "login");
    };

    const handleBackToLanding = () => {
        setView("landing");
    };

    const handleLogout = async () => {
        try {
            await auth.logout();
        } catch (err) {
            console.error("Logout error:", err);
        }

        setView("landing");
        setActiveTab("dashboard");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardPage />;
            case "tasks":
                return <TasksPage />;
            case "worklogs":
                return <WorkLogsPage />;
            case "analytics":
                return <AnalyticsPage />;
            case "teams":
                return <TeamsPage />;
            case "settings":
                return <SettingsPage />;
            default:
                return <DashboardPage />;
        }
    };

    if (view === "loading") {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <div className="text-synergy-light-gray">Loading...</div>
            </div>
        );
    }

    if (view === "landing") {
        return (
            <LandingPage
                onGetStarted={handleGetStarted}
                onLogin={handleLogin}
            />
        );
    }

    if (view === "login" || view === "signup") {
        return (
            <AuthPage
                mode={view}
                onSubmit={handleAuth}
                onToggleMode={handleToggleAuthMode}
                onBack={handleBackToLanding}
                error={error}
            />
        );
    }

    return (
        <div className="h-screen flex bg-background overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
            />
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}