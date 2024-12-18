import {NextUIProvider} from "@nextui-org/react";
import {useNavigate, useHref, Routes, Route} from "react-router";
import Freshness from "./Freshness";
import Header from "./Header.tsx";
import CropWaterRequirement from "./CropWatterRequirement.tsx";

function App() {
    const navigate = useNavigate();

    return (
        <NextUIProvider style={{ height: "100%" }} navigate={navigate} useHref={useHref}>
            <main className="dark text-foreground bg-background h-full">
                <Header/>
                <Routes>
                    <Route path="/fruit-freshness" element={<Freshness/>}/>
                    <Route path="/crop-watter-req" element={<CropWaterRequirement/>}/>
                </Routes>
            </main>
        </NextUIProvider>
);
}

export default App;
