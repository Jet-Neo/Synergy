import { LandingPage } from "./pages/LandingPage";

function App() {
    return (
        <LandingPage
            onGetStarted={() => console.log("Get Started")}
            onLogin={() => console.log("Login")}
        />
    );
}

export default App;