import { useState } from "react"

// backend base url
const BASE = "http://localhost:8000"

export default function Upload() {
  const [savedDocs, setSavedDocs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  async function uploadFiles(e) {
    const picked = Array.from(e.target.files)
    if (!picked.length) return
    setUploading(true)
    setErrMsg(null)

    for (let i = 0; i < picked.length; i++) {
      const f = picked[i]
      const fd = new FormData()
      fd.append("file", f)

      try {
        const resp = await fetch(`${BASE}/documents/upload`, {
          method: "POST",
          body: fd,
        })
        if (!resp.ok) {
          const body = await resp.json()
          throw new Error(body.detail || "upload error")
        }
        const json = await resp.json()
        setSavedDocs(prev => [...prev, { id: json.id, name: json.name, size: f.size }])
      } catch (err) {
        setErrMsg(`${f.name}: ${err.message}`)
        break
      }
    }

    setUploading(false)
    e.target.value = ""
  }

  async function deleteDoc(docId, idx) {
    const resp = await fetch(`${BASE}/documents/${docId}`, { method: "DELETE" })
    if (resp.ok) {
      setSavedDocs(prev => prev.filter((_, i) => i !== idx))
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">Upload Documents</h1>

        {errMsg && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex justify-between">
            <span>{errMsg}</span>
            <button onClick={() => setErrMsg(null)} className="ml-4 hover:text-white">✕</button>
          </div>
        )}

        <label
          htmlFor="file-input"
          className="block border-2 border-dashed border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:border-cyan-400 transition"
        >
          {uploading
            ? <p className="text-slate-300 text-lg">Uploading...</p>
            : <p className="text-slate-300 text-lg">Drag & drop files here, or click to browse</p>
          }
          <p className="text-sm text-slate-500 mt-2">Supports: .txt, .md, .pdf, .py, .js</p>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={uploadFiles}
            disabled={uploading}
          />
        </label>

        {uploading && (
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2" />
          </div>
        )}

        <div className="space-y-3">
          {savedDocs.length === 0 && !uploading
            ? <p className="text-slate-500 text-center">No files uploaded yet.</p>
            : savedDocs.map((doc, i) => (
              <div key={doc.id} className="flex items-center justify-between bg-slate-800 px-4 py-3 rounded-lg">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-slate-400">
                    {(doc.size / 1024).toFixed(1)} KB &nbsp;·&nbsp;
                    <span className="text-green-400">saved (id {doc.id})</span>
                  </p>
                </div>
                <button onClick={() => deleteDoc(doc.id, i)} className="text-red-400 hover:text-red-300 text-sm transition">
                  Remove
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
