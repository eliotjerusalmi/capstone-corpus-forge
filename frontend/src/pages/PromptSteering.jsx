import { useState } from "react"

export default function PromptSteering() {
  const [settings, setSettings] = useState({
    tone: "neutral",
    creativity: 50,
    strictness: 50,
    domain: "general",
    systemPrompt: ""
  })

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Prompt Steering Panel</h1>

      <div className="max-w-3xl mx-auto space-y-10">

        {/* Tone Selector */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Tone</h2>

          <select
            value={settings.tone}
            onChange={(e) => update("tone", e.target.value)}
            className="w-full bg-slate-700 p-3 rounded-lg"
          >
            <option value="neutral">Neutral</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="concise">Concise</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Creativity Slider */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Creativity</h2>

          <input
            type="range"
            min="0"
            max="100"
            value={settings.creativity}
            onChange={(e) => update("creativity", Number(e.target.value))}
            className="w-full accent-cyan-400"
          />

          <p className="text-slate-400 mt-2">Value: {settings.creativity}</p>
        </div>

        {/* Strictness Slider */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Strictness</h2>

          <input
            type="range"
            min="0"
            max="100"
            value={settings.strictness}
            onChange={(e) => update("strictness", Number(e.target.value))}
            className="w-full accent-blue-400"
          />

          <p className="text-slate-400 mt-2">Value: {settings.strictness}</p>
        </div>

        {/* Domain Selector */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Domain Focus</h2>

          <select
            value={settings.domain}
            onChange={(e) => update("domain", e.target.value)}
            className="w-full bg-slate-700 p-3 rounded-lg"
          >
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="medical">Medical</option>
            <option value="legal">Legal</option>
            <option value="creative">Creative Writing</option>
          </select>
        </div>

        {/* System Prompt Box */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Custom System Prompt</h2>

          <textarea
            value={settings.systemPrompt}
            onChange={(e) => update("systemPrompt", e.target.value)}
            placeholder="Enter custom instructions for the AI..."
            className="w-full h-40 bg-slate-700 p-4 rounded-lg resize-none"
          />
        </div>

        {/* Save Button */}
        <button
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-lg"
        >
          Save Settings
        </button>

      </div>
    </div>
  )
}
