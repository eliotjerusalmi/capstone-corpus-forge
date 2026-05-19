export default function Learn() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center space-y-8">

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Learn More
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-lg sm:text-xl leading-relaxed">
          This project demonstrates a modern frontend architecture built with 
          <span className="text-cyan-400 font-semibold"> React</span>, 
          <span className="text-blue-400 font-semibold"> Vite</span>, and 
          <span className="text-cyan-300 font-semibold"> Tailwind CSS</span>.
          It includes multiple interactive pages such as Upload, Chat, Flashcards, Quizzes, Reports, and Prompt Steering.
        </p>

        {/* Feature List */}
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl border border-slate-700 space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-300">What You Can Do</h2>

          <ul className="text-slate-300 space-y-2 text-left max-w-xl mx-auto">
            <li>• Upload documents and manage your corpus</li>
            <li>• Chat with an AI assistant</li>
            <li>• Generate flashcards for studying</li>
            <li>• Take quizzes based on your content</li>
            <li>• View analytics and reports</li>
            <li>• Customize prompt steering settings</li>
          </ul>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Go Back
        </button>

      </div>
    </div>
  )
}
