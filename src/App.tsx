import './pages/Index.css';
import { HashRouter } from "react-router-dom"; // ✅ 변경
import { ServicesProvider } from "./context/ServicesProvider.tsx";
import Router from "../src/router/Router.tsx";
import CustomCursor from './components/CustomCursor.tsx';
import { useEffect } from "react";
import { ThemeProvider } from './layouts/ThemeContext';
import { Analytics } from "@vercel/analytics/react";

function App() {
    useEffect(() => {
        document.title = "NODE";
    }, []);

    return (
        <ThemeProvider>
            <CustomCursor />
            <div className="App">
                <Analytics />
                <HashRouter>
                    <ServicesProvider>
                        <Router />
                    </ServicesProvider>
                </HashRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;
