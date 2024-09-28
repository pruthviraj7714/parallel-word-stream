import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
import ParallelWordStreaming from "./pages/Home";


export default function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<ParallelWordStreaming />} path="/home" />
        </Routes>
      </BrowserRouter>
    </>
  )
}