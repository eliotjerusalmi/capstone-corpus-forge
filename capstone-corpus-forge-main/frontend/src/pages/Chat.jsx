import { useState, useEffect, useRef } from "react"

const API_URL = "http://localhost:8000"

const INITIAL_MSG = { role: "ai", content: "Hello! Pick some documents below and ask me anything." }

export default function Chat() {
  const [history, setHistory] = useState([INITIAL_MSG])
  const [userInput, setUserInput] = useState("")
  const [waiting, setWaiting] = useState(false)
  const [docList, setDocList] = useState([])
  const [pickedDocs, setPickedDocs] = useState([])
  const [warn, setWarn] = useState("")
  const endRef = useRef(null)

  useEffect(() => {
    fetch(`${API_URL}/documents`)
      .then(r => r.json())
      .then(data => setDocList(data))
      .catch(() => setDocList([]))
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history, waiting])

  function togglePick(id) {
    setPickedDocs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function submit() {
    const txt = userInput.trim()
    if (!txt) return
    if (pickedDocs.length === 0) {
      setWarn("Select at least one document first.")
      return
    }
    setWarn("")
    setHistory(h => [...h, { role: "user", content: txt }])
    setUserInput("")
    setWaiting(true)

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "chat",
          document_ids: pickedDocs,
          prompt: txt,
          tone: "neutral",
          output_format: "text",
        }),
      })

      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.detail || "Request failed")
      }

      const data = await res.json()
      setHistory(h => [...h, {
        role: "ai",
        content: data.result,
        meta: `${data.tokens_used} tokens`
      }])
    } catch (err) {
      setHistory(h => [...h, { role: "ai", content: `⚠ ${err.message}`, isErr: true }])
    } finally {
      setWaiting(false)
    }
  }

  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">

      <header className="py-5 px-6 border-b border-slate-700 text-center shrink-0">
        <h1 className="text-2xl font-bold">Chat with Your Corpus</h1>
      </header>

      {/* doc picker */}
      {docList.length > 0 && (
        <div className="px-5 py-2 bg-slate-800/70 border-b border-slate-700 flex flex-wrap gap-2 shrink-0">
          <span className="text-xs text-slate-400 self-center">Docs:</span>
          {docList.map(d => (
            <button
              key={d.id}
              onClick={() => togglePick(d.id)}
              className={`text-xs px-3 py-1 rounded-full transition ${pickedDocs.includes(d.id) ? "bg-cyan-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {warn && <p className="text-center text-xs text-amber-400 py-1 bg-slate-800/50">{warn}</p>}

      {/* message list */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user" ? "bg-cyan-600" : msg.isErr ? "bg-red-900 text-red-200" : "bg-slate-800"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.meta && <p className="text-xs text-slate-400 mt-1 text-right">{msg.meta}</p>}
            </div>
          </div>
        ))}
        {waiting && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl text-slate-400 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* input */}
      <div className="shrink-0 px-5 py-4 border-t border-slate-700 flex gap-3">
        <input
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={pickedDocs.length === 0 ? "Select a document first..." : "Ask something... (Enter to send)"}
          disabled={waiting}
          className="flex-1 bg-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={submit}
          disabled={waiting || !userInput.trim()}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 rounded-lg text-sm font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
