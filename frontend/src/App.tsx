import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Upload from "./pages/Upload"
import DocumentManager from "./pages/DocumentManager"
import Chat from "./pages/Chat"
import Flashcards from "./pages/Flashcards"
import Quiz from "./pages/Quiz"
import Reports from "./pages/Reports"
import PromptSteering from "./pages/PromptSteering"
import CostDashboard from "./pages/CostDashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/documents" element={<DocumentManager />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/prompt" element={<PromptSteering />} />
        <Route path="/costs" element={<CostDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
