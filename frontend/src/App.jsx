import { useState } from "react"
import CodeEditor from "./components/CodeEditor"

const App = () => {
  const [userName, setUserName] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [input, setInput] = useState("")

  const handleJoin = (e) => {
    e.preventDefault()
    if (input.trim() !== "") {
      setUserName(input)
    }
    window.history.pushState({}, "", "?username=" + input)
  }

  if (!userName) {
    return (
      <main className="w-full h-screen bg-gray-900 text-white flex p-4 gap-2 items-center justify-center">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="bg-gray-800 p-2 rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit" 
            className="bg-blue-500 p-2 rounded-lg"
          >
            Join
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="w-full h-screen bg-gray-900 text-white flex p-4 gap-2">
      <aside className="w-2/12 h-full bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col gap-4">
          <p></p>
        </div>
      </aside>
      <section className="w-10/12 h-full bg-gray-700 rounded-lg">
        <CodeEditor userName={userName} /> 
      </section>
    </main>
  )
}

export default App