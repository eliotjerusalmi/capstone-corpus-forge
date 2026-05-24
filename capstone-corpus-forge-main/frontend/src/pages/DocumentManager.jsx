import { useState, useEffect, useCallback } from "react"

const BACKEND = "http://localhost:8000"

export default function DocumentManager() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorText, setErrorText] = useState(null)
  // track which doc ids are selected for AI
  const [activeSet, setActiveSet] = useState(new Set())

  const loadDocs = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(BACKEND + "/documents")
      if (!r.ok) throw new Error("Could not reach backend")
      setDocs(await r.json())
    } catch (e) {
      setErrorText(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDocs() }, [loadDocs])

  function toggleActive(id) {
    setActiveSet(prev => {
      const copy = new Set(prev)
      copy.has(id) ? copy.delete(id) : copy.add(id)
      return copy
    })
  }

  async function handleDelete(id) {
    try {
      const r = await fetch(`${BACKEND}/documents/${id}`, { method: "DELETE" })
      if (!r.ok) throw new Error("Delete failed")
      setDocs(prev => prev.filter(d => d.id !== id))
      setActiveSet(prev => { const s = new Set(prev); s.delete(id); return s })
    } catch (e) {
      setErrorText(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Document Manager</h1>
          <button onClick={loadDocs} className="text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
            ↻ Refresh
          </button>
        </div>

        {activeSet.size > 0 && (
          <p className="text-cyan-400 text-sm mb-4">
            {activeSet.size} document(s) active for AI
          </p>
        )}

        {errorText && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-900/40 border border-red-600 text-red-200 text-sm flex justify-between">
            <span>{errorText}</span>
            <button onClick={() => setErrorText(null)}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3 mt-4">
            {[0, 1, 2].map(n => <div key={n} className="h-14 bg-slate-800 rounded-lg animate-pulse" />)}
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center mt-20 text-slate-500">
            <p>No documents found.</p>
            <p className="text-sm mt-1">Go to Upload to add some files.</p>
          </div>
        ) : (
          <ul className="space-y-3 mt-4">
            {docs.map(doc => (
              <li
                key={doc.id}
                className={`flex items-center justify-between px-5 py-4 rounded-lg ${activeSet.has(doc.id) ? "bg-slate-700 ring-1 ring-cyan-600" : "bg-slate-800"}`}
              >
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    id: {doc.id} · {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={activeSet.has(doc.id)}
                      onChange={() => toggleActive(doc.id)}
                      className="accent-cyan-400"
                    />
                    Active for AI
                  </label>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-400 hover:text-red-200 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
