import { Link, useNavigate } from "react-router-dom"

const NAV_ITEMS = [
  { path: "/upload",    name: "Upload",           hint: "Add files to your corpus" },
  { path: "/documents", name: "Documents",         hint: "Manage your corpus" },
  { path: "/chat",      name: "Chat",              hint: "Ask questions" },
  { path: "/flashcards",name: "Flashcards",        hint: "Study with AI-made cards" },
  { path: "/quiz",      name: "Quiz",              hint: "Test your knowledge" },
  { path: "/reports",   name: "Reports",           hint: "Usage stats" },
  { path: "/prompt",    name: "Prompt settings",   hint: "Tune tone & creativity" },
  { path: "/costs",     name: "Cost dashboard",    hint: "Track token usage" },
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">

        <h1 className="text-6xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Corpus Forge
          </span>
        </h1>

        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
          Upload your documents and use them as a knowledge base — generate flashcards, take quizzes,
          and chat with an AI that answers based on your own files.
        </p>

        <div className="flex justify-center gap-3 mb-14">
          <button
            onClick={() => nav("/upload")}
            className="px-7 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white font-semibold rounded-lg transition hover:scale-105"
          >
            Start uploading
          </button>
          <button
            onClick={() => nav("/chat")}
            className="px-7 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
          >
            Open chat
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="block p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-700 rounded-xl transition group"
            >
              <p className="font-medium text-white group-hover:text-cyan-400 transition text-sm">{item.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.hint}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
