import { useState } from "react"
import CodeEditor from "./components/CodeEditor"

const App = () => {
  const [userName, setUserName] = useState(() => new URLSearchParams(window.location.search).get("username") || "")
  const [roomName, setRoomName] = useState(() => new URLSearchParams(window.location.search).get("room") || "")
  
  const [nameInput, setNameInput] = useState(userName) // Pre-fill if they are switching rooms
  const [roomInput, setRoomInput] = useState("")
  const [connectedUsers, setConnectedUsers] = useState([])

  const handleJoin = (e) => {
    e.preventDefault()
    if (nameInput.trim() !== "" && roomInput.trim() !== "") {
      setUserName(nameInput)
      setRoomName(roomInput)
      window.history.pushState({}, "", `?room=${roomInput}&username=${nameInput}`)
    }
  }

  const handleSwitchRoom = () => {
    // Clear the room state to trigger the join screen
    setRoomName("")
    // Update the URL to remove the room parameter, but keep the username
    window.history.pushState({}, "", `?username=${userName}`)
  }

  if (!userName || !roomName) {
    return (
      <main className="w-full h-screen bg-gray-900 text-white flex p-4 gap-2 items-center justify-center">
        <form onSubmit={handleJoin} className="flex flex-col gap-4 w-80">
          <h1 className="text-2xl font-bold text-center mb-4">Join Covalent</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className="bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter group/room name"
            className="bg-gray-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition-colors p-2 rounded-lg font-semibold">
            Join Group
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="w-full h-screen bg-gray-900 text-white flex p-4 gap-2">
      {/* UPDATE: Added flex-col and relative positioning to the aside */}
      <aside className="w-2/12 h-full bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
        <div className="border-b border-gray-700 pb-2">
          <h2 className="text-xl font-bold text-blue-400">{roomName}</h2>
          <p className="text-sm text-gray-400">Active Users</p>
        </div>
        
        {/* Added flex-grow and overflow-y-auto so a long list of users scrolls instead of pushing the button off screen */}
        <ul className="flex flex-col gap-3 flex-grow overflow-y-auto">
          {connectedUsers.map((user, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              {user}
            </li>
          ))}
        </ul>

        {/* NEW: The Switch Room Button locked to the bottom */}
        <button 
          onClick={handleSwitchRoom}
          className="w-full bg-gray-700 hover:bg-gray-600 text-sm font-semibold p-2 rounded-lg transition-colors mt-auto"
        >
          Switch Room
        </button>
      </aside>
      
      <section className="w-10/12 h-full bg-gray-700 rounded-lg">
        <CodeEditor 
          userName={userName} 
          roomName={roomName}
          onUsersChange={setConnectedUsers} 
        /> 
      </section>
    </main>
  )
}

export default App