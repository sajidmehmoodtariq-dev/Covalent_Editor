import { useState } from "react"
import CodeEditor from "./components/CodeEditor"

const App = () => {
  const [userName, setUserName] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [input, setInput] = useState("")
  const [connectedUsers, setConnectedUsers] = useState([])

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
      {/* UPDATED: Sidebar now renders the connected users */}
      <aside className="w-2/12 h-full bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold border-b border-gray-700 pb-2">Online Now</h2>
        <ul className="flex flex-col gap-3">
          {connectedUsers.map((user, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              {user}
            </li>
          ))}
        </ul>
      </aside>
      
      <section className="w-10/12 h-full bg-gray-700 rounded-lg">
        <CodeEditor 
          userName={userName} 
          onUsersChange={setConnectedUsers} 
        /> 
      </section>
    </main>
  )
}

export default App