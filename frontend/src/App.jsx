import CodeEditor from "./components/CodeEditor"


const App = () => {
  return (
    <main className="w-full h-screen bg-gray-900 text-white flex p-4 gap-2">
      <aside className="w-2/12 h-full bg-gray-800 p-4 rounded-lg  ">

      </aside>
      <section className="w-10/12 h-full bg-gray-700 rounded-lg">
        <CodeEditor />
      </section>
    </main>
  )
}

export default App