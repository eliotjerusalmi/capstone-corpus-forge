import { useState, useEffect } from "react"

const SERVER = "http://localhost:8000"

// tries to extract Q/A pairs from the raw text returned by the backend
function extractCards(raw) {
  const result = []
  const chunks = raw.split(/\n{2,}/)
  for (const chunk of chunks) {
    const q = chunk.match(/Q\d*[:.]\s*(.+)/i)
    const a = chunk.match(/A\d*[:.]\s*(.+)/i)
    if (q && a) result.push({ front: q[1].trim(), back: a[1].trim() })
  }
  if (result.length === 0) {
    // fallback: just show raw text as one card
    return [{ front: "Generated content", back: raw.slice(0, 300) }]
  }
  return result
}

export default function Flashcards() {
  const [cards, setCards] = useState([
    { front: "What is a corpus?", back: "A structured collection of documents." },
    { front: "What is embedding?", back: "A vector representation of text in high-dimensional space." },
  ])
  const [cardIndex, setCardIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const [allDocs, setAllDocs] = useState([])
  const [chosenDoc, setChosenDoc] = useState("")
  const [busy, setBusy] = useState(false)
  const [genError, setGenError] = useState(null)

  useEffect(() => {
    fetch(`${SERVER}/documents`)
      .then(r => r.json())
      .then(setAllDocs)
      .catch(() => {})
  }, [])

  async function generate() {
    if (!chosenDoc) { setGenError("Pick a document first."); return }
    setBusy(true)
    setGenError(null)
    try {
      const res = await fetch(`${SERVER}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "flashcards",
          document_ids: [Number(chosenDoc)],
          prompt: "Create study flashcards from this document.",
        }),
      })
      if (!res.ok) throw new Error("Generation failed")
      const payload = await res.json()
      const newCards = extractCards(payload.result)
      setCards(newCards)
      setCardIndex(0)
      setShowBack(false)
    } catch (e) {
      setGenError(e.message)
    } finally {
      setBusy(false)
    }
  }

  function next() { setShowBack(false); setCardIndex(i => (i + 1) % cards.length) }
  function prev() { setShowBack(false); setCardIndex(i => (i - 1 + cards.length) % cards.length) }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Flashcards</h1>

      {/* generation controls */}
      <div className="flex gap-2 mb-6 w-full max-w-md">
        <select
          value={chosenDoc}
          onChange={e => setChosenDoc(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Choose document…</option>
          {allDocs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button
          onClick={generate}
          disabled={busy || !chosenDoc}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg text-sm font-medium transition"
        >
          {busy ? "…" : "Generate"}
        </button>
      </div>

      {genError && <p className="text-red-400 text-sm mb-4">{genError}</p>}

      <p className="text-slate-500 text-xs mb-3">{cardIndex + 1} / {cards.length} — click to flip</p>

      {/* the card */}
      <div
        onClick={() => setShowBack(b => !b)}
        className="w-80 h-52 bg-slate-800 hover:bg-slate-750 rounded-2xl flex items-center justify-center px-8 text-center text-lg cursor-pointer select-none transition hover:scale-105 shadow-lg"
      >
        <span className={showBack ? "text-cyan-300" : ""}>
          {showBack ? cards[cardIndex].back : cards[cardIndex].front}
        </span>
      </div>
      <p className="text-xs text-slate-600 mt-2">{showBack ? "answer" : "question"}</p>

      <div className="flex gap-4 mt-8">
        <button onClick={prev} className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition">← Prev</button>
        <button onClick={next} className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-600 rounded-lg text-sm transition">Next →</button>
      </div>
    </div>
  )
}
