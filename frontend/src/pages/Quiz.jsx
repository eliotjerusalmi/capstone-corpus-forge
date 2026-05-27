import { useState, useEffect } from "react"

const BACKEND_URL = "http://localhost:8000"

// quick and dirty quiz parser - works well enough for the backend format
function parseQuestions(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean)
  const questions = []
  let curr = null

  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      if (curr) questions.push(curr)
      curr = { question: line.replace(/^\d+\.\s*/, ""), options: [], answer: 0 }
    } else if (/^[a-d][.)]/i.test(line) && curr) {
      curr.options.push(line.replace(/^[a-d][.)]\s*/i, ""))
    } else if (/answer/i.test(line) && curr) {
      const m = line.match(/[a-d]/i)
      if (m) curr.answer = "abcd".indexOf(m[0].toLowerCase())
    }
  }
  if (curr) questions.push(curr)

  return questions.length ? questions : [{
    question: "What is the main topic of the selected document?",
    options: ["Can't tell", "Something technical", "Something else", "None of the above"],
    answer: 0
  }]
}

export default function Quiz() {
  const [questions, setQuestions] = useState([
    {
      question: "What is a corpus?",
      options: ["A neural network type", "A collection of documents", "A database engine", "A sorting algorithm"],
      answer: 1
    }
  ])

  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const [documents, setDocuments] = useState([])
  const [docId, setDocId] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  useEffect(() => {
    fetch(`${BACKEND_URL}/documents`)
      .then(r => r.json())
      .then(setDocuments)
      .catch(() => {})
  }, [])

  const score = Object.keys(answers).reduce((n, i) => {
    return n + (answers[i] === questions[i].answer ? 1 : 0)
  }, 0)

  async function generateNewQuiz() {
    if (!docId) { setErr("Select a document."); return }
    setLoading(true)
    setErr("")

    try {
      const res = await fetch(`${BACKEND_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "quiz",
          document_ids: [parseInt(docId)],
          prompt: "Write 5 multiple choice questions (a-d) about this document. Mark the correct answer.",
          tone: "neutral",
        }),
      })

      if (!res.ok) throw new Error("Backend error")
      const data = await res.json()
      setQuestions(parseQuestions(data.result))
      setAnswers({})
      setDone(false)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  function pick(qi, oi) {
    if (done) return
    setAnswers(a => ({ ...a, [qi]: oi }))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-5 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Quiz</h1>

      <div className="max-w-2xl mx-auto">

        {/* generate bar */}
        <div className="flex gap-2 mb-6">
          <select
            value={docId}
            onChange={e => setDocId(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select document…</option>
            {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button
            onClick={generateNewQuiz}
            disabled={loading || !docId}
            className="px-4 py-2 text-sm font-medium bg-blue-700 hover:bg-blue-600 disabled:opacity-40 rounded-lg transition"
          >
            {loading ? "Generating…" : "New Quiz"}
          </button>
        </div>

        {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

        <div className="space-y-6">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-slate-800 rounded-xl p-5">
              <p className="font-semibold mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let cls = "bg-slate-700 hover:bg-slate-600"
                  if (done) {
                    if (oi === q.answer) cls = "bg-green-700"
                    else if (answers[qi] === oi) cls = "bg-red-800"
                    else cls = "bg-slate-700 opacity-60"
                  } else if (answers[qi] === oi) {
                    cls = "bg-cyan-700"
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${cls}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {!done ? (
          <button
            onClick={() => setDone(true)}
            disabled={Object.keys(answers).length < questions.length}
            className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 rounded-xl font-semibold transition"
          >
            Submit
          </button>
        ) : (
          <div className="mt-6 text-center space-y-3">
            <p className="text-2xl font-bold">{score} / {questions.length}</p>
            <p className="text-slate-400 text-sm">
              {score === questions.length ? "Perfect!" : score > questions.length / 2 ? "Not bad!" : "Keep going!"}
            </p>
            <button
              onClick={() => { setAnswers({}); setDone(false) }}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
