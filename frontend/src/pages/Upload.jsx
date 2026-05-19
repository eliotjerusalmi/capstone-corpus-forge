import { useState } from "react"

export default function Upload() {
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)   

  // Handle file selection
  const handleFileUpload = (event) => {
    const uploaded = Array.from(event.target.files)

    //  Start loading animation
    setIsLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      setFiles((prev) => [...prev, ...uploaded])
      setIsLoading(false)   //  Stop loading
    }, 900)
  }

  // Remove a file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center">
          Upload Documents
        </h1>

        {/* Upload Zone */}
        <label
          htmlFor="file-upload"
          className="block border-2 border-dashed border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:border-cyan-400 transition"
        >
          <p className="text-lg text-slate-300">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Supports: .txt, .md, .pdf, .py, .js
          </p>

          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/*  Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            <div className="h-4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2" />
          </div>
        )}

        {/* File List */}
        {!isLoading && (
          <div className="space-y-4">
            {files.length === 0 ? (
              <p className="text-slate-500 text-center">
                No files uploaded yet.
              </p>
            ) : (
              files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-800 px-4 py-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    {/* Select for AI toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-cyan-400"
                      />
                      <span className="text-sm text-slate-300">
                        Use for AI
                      </span>
                    </label>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}
