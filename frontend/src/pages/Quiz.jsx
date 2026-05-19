import { useState } from "react"

export default function Quiz() {
  const [questions, setQuestions] = useState([
    {
      question: "What is a corpus?",
      options: [
        "A type of neural network",
        "A structured collection of documents",
        "A compression algorithm",
        "A database query language"
      ],
      answer: 1
    },
    {
      question: "What is tokenization?",
      options: [
        "Converting text into vectors",
        "Splitting text into smaller units",
        "Removing stopwords",
        "Compressing text"
      ],
      answer: 1
    }
  ])

  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (qIndex, optionIndex) => {
    setSelected((prev) => ({ ...prev, [qIndex]: optionIndex }))
  }

  const submitQuiz = () => {
    setSubmitted(true)
  }

  const score = Object.keys(selected).reduce((acc, qIndex) => {
    return acc + (selected[qIndex] === questions[qIndex].answer ? 1 : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Quiz</h1>

      <div className="max-w-3xl mx-auto space-y-10">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-slate-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, optIndex) => (
                <label
                  key={optIndex}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
                    ${
                      submitted
                        ? optIndex === q.answer
                          ? "bg-green-700"
                          : selected[qIndex] === optIndex
                          ? "bg-red-700"
                          : "bg-slate-700"
                        : selected[qIndex] === optIndex
                        ? "bg-cyan-700"
                        : "bg-slate-700"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={selected[qIndex] === optIndex}
                    onChange={() => handleSelect(qIndex, optIndex)}
                    className="accent-cyan-400"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={submitQuiz}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-lg"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="text-center text-2xl font-bold">
            Score: {score} / {questions.length}
          </div>
        )}

        <button
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold mt-4"
        >
          Generate New Quiz
        </button>
      </div>
    </div>
  )
}
