import { useState, useEffect } from "react"

const API = "http://localhost:8000"

export default function CostDashboard() {
  const [requests, setRequests] = useState([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  async function loadUsage() {
    setFetching(true)
    setFetchError(null)
    try {
      const r = await fetch(`${API}/usage`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      setRequests(await r.json())
    } catch (e) {
      setFetchError("Could not load usage data: " + e.message)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { loadUsage() }, [])

  const totalTok = requests.reduce((s, r) => s + (r.tokens_used || 0), 0)
  const byTask = requests.reduce((acc, r) => {
    const t = r.meta?.task || "other"
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Cost & Usage</h1>
          <button onClick={loadUsage} className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition">
            Refresh
          </button>
        </div>

        {fetchError && <p className="text-red-400 text-sm mb-6">{fetchError}</p>}

        {/* stat row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total calls", val: fetching ? "—" : requests.length },
            { label: "Total tokens", val: fetching ? "—" : totalTok.toLocaleString() },
            { label: "Avg tokens", val: fetching || !requests.length ? "—" : Math.round(totalTok / requests.length) },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 rounded-xl p-5 text-center">
              <p className="text-slate-400 text-sm">{s.label}</p>
              <p className="text-2xl font-semibold mt-1">{s.val}</p>
            </div>
          ))}
        </div>

        {/* breakdown */}
        {Object.keys(byTask).length > 0 && (
          <div className="bg-slate-800 rounded-xl p-5 mb-6">
            <h2 className="font-semibold mb-4 text-slate-200">By task</h2>
            <div className="space-y-3">
              {Object.entries(byTask).sort((a, b) => b[1] - a[1]).map(([task, count]) => (
                <div key={task}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-slate-300">{task}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full">
                    <div
                      className="h-1.5 bg-cyan-500 rounded-full"
                      style={{ width: `${(count / requests.length * 100).toFixed(0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* log table */}
        <div className="bg-slate-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4 text-slate-200">Request log</h2>
          {fetching ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-6 bg-slate-700 rounded animate-pulse" />)}
            </div>
          ) : requests.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No requests yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700 text-left">
                  <th className="pb-2 font-normal">Time</th>
                  <th className="pb-2 font-normal">Task</th>
                  <th className="pb-2 font-normal text-right">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} className="border-b border-slate-700/40">
                    <td className="py-2 text-slate-400 text-xs">{new Date(r.timestamp).toLocaleString("fr-FR")}</td>
                    <td className="py-2 capitalize">{r.meta?.task || "—"}</td>
                    <td className="py-2 text-right text-cyan-400">{r.tokens_used}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
