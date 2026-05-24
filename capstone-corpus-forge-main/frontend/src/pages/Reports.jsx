import { useState } from "react"

export default function Reports() {
  const [stats] = useState({
    totalQueries: 128,
    totalTokens: 45210,
    totalCost: 1.82,
    avgResponseTime: "1.2s",
    topDocuments: [
      { name: "notes.md", uses: 42 },
      { name: "report.pdf", uses: 31 },
      { name: "script.py", uses: 18 }
    ]
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Reports & Analytics</h1>

      <div className="max-w-4xl mx-auto space-y-10">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">Total Queries</p>
            <p className="text-3xl font-bold">{stats.totalQueries}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">Total Tokens</p>
            <p className="text-3xl font-bold">{stats.totalTokens}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">Total Cost</p>
            <p className="text-3xl font-bold">${stats.totalCost}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">Avg Response Time</p>
            <p className="text-3xl font-bold">{stats.avgResponseTime}</p>
          </div>
        </div>

        {/* Top Documents */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Most Queried Documents</h2>

          <div className="space-y-4">
            {stats.topDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex justify-between bg-slate-700 px-4 py-3 rounded-lg"
              >
                <span>{doc.name}</span>
                <span className="text-cyan-400">{doc.uses} uses</span>
              </div>
            ))}
          </div>
        </div>

        {/* WORD CLOUD */}
        <div className="bg-slate-800 dark:bg-slate-200 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Document Word Cloud</h2>

          <div className="flex flex-wrap gap-4">
            {stats.topDocuments.map((doc, i) => {
              const size = 14 + doc.uses
              return (
                <span
                  key={i}
                  style={{ fontSize: `${size}px` }}
                  className="text-cyan-300 dark:text-cyan-700 font-semibold"
                >
                  {doc.name}
                </span>
              )
            })}
          </div>
        </div>

        {/* USAGE GRAPH  */}
        <div className="bg-slate-800 dark:bg-slate-200 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Document Usage Graph</h2>

          <div className="space-y-4">
            {stats.topDocuments.map((doc, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{doc.name}</span>
                  <span className="text-slate-400 dark:text-slate-600">
                    {doc.uses} uses
                  </span>
                </div>

                <div className="w-full bg-slate-700 dark:bg-slate-300 h-3 rounded">
                  <div
                    className="h-3 rounded bg-cyan-500 dark:bg-cyan-700"
                    style={{ width: `${Math.min(doc.uses * 3, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for charts */}
        <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
          <p className="text-slate-400 mb-2">Charts Coming Soon</p>
          <p className="text-sm text-slate-500">
            (Backend will provide usage graphs, cost trends, and performance metrics.)
          </p>
        </div>

      </div>
    </div>
  )
}
