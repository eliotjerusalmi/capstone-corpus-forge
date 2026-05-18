import { useState } from "react"

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! Ask me anything about your corpus." }
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }])

    // Clear input
    setInput("")

    // Placeholder AI
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "This is where the AI response will appear." }
      ])
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-700 text-center">
        <h1 className="text-3xl font-bold">Chat with Your Corpus</h1>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl px-4 py-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-cyan-600 ml-auto"
                : "bg-slate-800 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-700 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
