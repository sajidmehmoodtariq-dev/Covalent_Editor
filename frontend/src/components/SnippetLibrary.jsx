import { useState, useEffect } from 'react';

const SnippetLibrary = () => {
  // Load snippets from localStorage on initial render
  const [snippets, setSnippets] = useState(() => {
    const saved = localStorage.getItem('covalent_snippets');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Auto-save to localStorage whenever snippets change
  useEffect(() => {
    localStorage.setItem('covalent_snippets', JSON.stringify(snippets));
  }, [snippets]);

  const handleAddSnippet = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const newSnippet = {
      id: crypto.randomUUID(),
      title,
      code,
    };

    setSnippets([...snippets, newSnippet]);
    setTitle('');
    setCode('');
    setIsAdding(false);
  };

  const deleteSnippet = (id) => {
    setSnippets(snippets.filter((s) => s.id !== id));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: You could add a tiny toast notification state here
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 p-4 rounded-lg gap-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-xl font-bold text-blue-400">My Snippets</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded transition-colors"
        >
          {isAdding ? 'Cancel' : '+ New'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSnippet} className="flex flex-col gap-2 bg-gray-700 p-3 rounded-md">
          <input
            type="text"
            placeholder="Snippet Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-900 text-white text-sm p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Paste code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-900 text-white text-sm p-2 rounded h-24 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-1 rounded transition-colors">
            Save Snippet
          </button>
        </form>
      )}

      <ul className="flex flex-col gap-3 flex-grow overflow-y-auto pr-1">
        {snippets.length === 0 && !isAdding && (
          <p className="text-sm text-gray-500 text-center mt-4">No snippets saved yet.</p>
        )}
        {snippets.map((snippet) => (
          <li key={snippet.id} className="bg-gray-700 rounded-md p-3 flex flex-col gap-2 group">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-200 text-sm">{snippet.title}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => copyToClipboard(snippet.code)}
                  className="text-gray-400 hover:text-blue-400 text-xs transition-colors"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
                <button 
                  onClick={() => deleteSnippet(snippet.id)}
                  className="text-gray-400 hover:text-red-400 text-xs transition-colors"
                  title="Delete snippet"
                >
                  Drop
                </button>
              </div>
            </div>
            <pre className="bg-gray-900 p-2 rounded text-xs text-gray-300 font-mono overflow-x-auto">
              <code>{snippet.code}</code>
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnippetLibrary;