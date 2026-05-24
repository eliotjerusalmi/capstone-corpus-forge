import { useState } from "react"

export default function CostDashboard() {
  const [costs] = useState({
    totalCost: 1.82,
    monthlyCost: 0.94,
    avgCostPerQuery: 0.014,
    tokenUsage: [
      { model: "gpt-4o-mini", tokens: 21000, cost: 0.42 },
      { model: "gpt-4o", tokens: 9000, cost: 0.90 },
      { model: "embedding-3-small", tokens: 15210, cost: 0.50 }
    ]
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Cost Dashboard</h1>

      <div className="max-w-4xl mx-auto space-y-10">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">Total Cost</p>
            <p className="text-3xl font-bold">${costs.totalCost}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">This Month</p>
            <p className="text-3xl font-bold">${costs.monthlyCost}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <p className="text-slate-400">Avg Cost / Query</p>
            <p className="text-3xl font-bold">${costs.avgCostPerQuery}</p>
          </div>
        </div>

        {/* Token Usage Table */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Token Usage by Model</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="py-3">Model</th>
                  <th className="py-3">Tokens</th>
                  <th className="py-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {costs.tokenUsage.map((row, index) => (
                  <tr key={index} className="border-b border-slate-700">
                    <td className="py-3">{row.model}</td>
                    <td className="py-3">{row.tokens.toLocaleString()}</td>
                    <td className="py-3 text-cyan-400">${row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder for charts */}
        <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
          <p className="text-slate-400 mb-2">Cost Trend Charts Coming Soon</p>
          <p className="text-sm text-slate-500">
            (Backend will provide cost over time, model usage graphs, and token breakdowns.)
          </p>
        </div>

      </div>
    </div>
  )
}
