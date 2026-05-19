import { useState } from "react"

export default function Flashcards() {
  const [cards, setCards] = useState([
    { front: "What is a corpus?", back: "A structured collection of documents." },
    { front: "What is embedding?", back: "A vector representation of text." }
  ])

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const nextCard = () => {
    setFlipped(false)
    setIndex((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setFlipped(false)
    setIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-6 py-10">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-10">Flashcards</h1>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-96 h-56 bg-slate-800 rounded-xl shadow-lg flex items-center justify-center text-center text-xl cursor-pointer transition-transform duration-500 hover:scale-105"
      >
        {flipped ? cards[index].back : cards[index].front}
      </div>

      {/* Controls */}
      <div className="flex gap-6 mt-8">
        <button
          onClick={prevCard}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
        >
          Previous
        </button>

        <button
          onClick={nextCard}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg"
        >
          Next
        </button>
      </div>

      {/* Generate Button (placeholder) */}
      <button
        className="mt-10 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
      >
        Generate Flashcards
      </button>

    </div>
  )
}
