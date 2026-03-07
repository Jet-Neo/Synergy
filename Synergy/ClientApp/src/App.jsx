import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

function App() {
    const [page, setPage] = useState("landing");

    if (page === "login") {
        return <LoginPage onBack={() => setPage("landing")} />;
    }

    return (
        <LandingPage
            onGetStarted={() => setPage("login")}
            onLogin={() => setPage("login")}
        />
    );
}

export default App;