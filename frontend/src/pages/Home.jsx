import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600">
            Welcome Home
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed">
          Build modern, responsive applications with React and Tailwind CSS.
          Experience the power of rapid development combined with beautiful design.
        </p>

        {/* CTA Button */}
        <div className="pt-4 sm:pt-6">
          <button
            type="button"
            className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Secondary CTA */}
        <div>
          <button
            type="button"
            className="text-slate-300 hover:text-white font-medium transition-colors duration-300 underline underline-offset-4"
          >
            Learn More →
          </button>
        </div>

        {/* Navigation Links */}
        <div className="pt-6 flex flex-col space-y-3">
          <Link 
            to="/upload" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Go to Upload →
          </Link>

          <Link 
            to="/documents" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Manage Documents →
          </Link>

          <Link 
            to="/chat" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Chat →
          </Link>

          <Link 
            to="/flashcards" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Flashcards →
          </Link>

          <Link 
            to="/quiz" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Quiz →
          </Link>

          <Link 
            to="/reports" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Reports →
          </Link>

          <Link 
            to="/prompt" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Prompt Steering →
          </Link>

          <Link 
            to="/costs" 
            className="text-cyan-400 hover:text-cyan-200 underline text-lg"
          >
            Cost Dashboard →
          </Link>

        </div>

      </div>
    </div>
  )
}
