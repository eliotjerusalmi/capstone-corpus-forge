import { useState } from "react"

export default function DocumentManager() {
  const [documents, setDocuments] = useState([
    // Example placeholder data — backend will replace this later
    { name: "notes.md", size: 1200, active: true },
    { name: "report.pdf", size: 54000, active: false },
    { name: "script.py", size: 8000, active: true },
  ])

  // Toggle active state
  const toggleActive = (index) => {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, active: !doc.active } : doc
      )
    )
  }

  // Remove document
  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center">
          Document Manager
        </h1>

        {/* Document List */}
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-slate-500 text-center">
              No documents available.
            </p>
          ) : (
            documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-800 px-5 py-4 rounded-lg shadow"
              >
                {/* Document Info */}
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm text-slate-400">
                    {(doc.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">

                  {/* Active Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.active}
                      onChange={() => toggleActive(index)}
                      className="accent-cyan-400"
                    />
                    <span className="text-sm text-slate-300">
                      Active for AI
                    </span>
                  </label>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeDocument(index)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
