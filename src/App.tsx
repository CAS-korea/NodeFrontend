import './pages/index.css'
import {BrowserRouter} from "react-router-dom";
import {ServicesProvider} from "./context/ServicesProvider.tsx";
import Router from "../src/router/Router.tsx"; // Router 컴포넌트를 별도 파일에서 import
import CustomCursor from './components/CustomCursor.tsx';
import {useEffect} from "react";
import { ThemeProvider } from './layouts/ThemeContext'; // 전역 테마 컨텍스트


function App() {
    useEffect(() => {
        document.title = "NODE";
    }, []);

    return (
        <ThemeProvider>
            <div className="App">
                <CustomCursor />
                <BrowserRouter>
                    <ServicesProvider>
                        <Router />
                    </ServicesProvider>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;
