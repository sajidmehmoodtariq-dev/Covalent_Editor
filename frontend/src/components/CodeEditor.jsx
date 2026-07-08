import Editor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { useState, useMemo, useEffect } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

// Define the languages you want to support
const SUPPORTED_LANGUAGES = ['javascript', 'python', 'cpp', 'typescript', 'html', 'css', 'json'];

const CodeEditor = ({ userName, roomName, onUsersChange }) => {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState('javascript'); // Local UI state

  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText('monaco'), [ydoc]);
  
  // NEW: A shared dictionary to store room configuration
  const yconfig = useMemo(() => ydoc.getMap('config'), [ydoc]); 

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  useEffect(() => {
    if (!editor || !userName || !roomName) return;

    const model = editor.getModel();
    if (!model) return;

    const provider = new SocketIOProvider(window.location.origin, roomName, ydoc, { autoConnect: true });
    
    provider.awareness.setLocalStateField('user', { name: userName });

    const updateUsersList = () => {
      const states = provider.awareness.getStates();
      const usersArray = [];
      
      states.forEach((state) => {
        if (state.user && state.user.name) {
          usersArray.push(state.user.name);
        }
      });

      const uniqueUsers = [...new Set(usersArray)];
      
      if (onUsersChange) {
        onUsersChange(uniqueUsers);
      }
    };

    // NEW: Listen for language changes made by other users in the room
    yconfig.observe(() => {
      const syncedLanguage = yconfig.get('language');
      if (syncedLanguage && syncedLanguage !== language) {
        setLanguage(syncedLanguage);
      }
    });

    // On initial connection, check if a language was already set by someone else
    provider.on('sync', (isSynced) => {
      if (isSynced) {
        const existingLanguage = yconfig.get('language');
        if (existingLanguage) setLanguage(existingLanguage);
      }
    });

    provider.awareness.on('change', updateUsersList);
    updateUsersList();

    const binding = new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      provider.awareness
    );

    return () => {
      provider.awareness.off('change', updateUsersList);
      binding.destroy();
      provider.disconnect();
    };
  }, [editor, userName,language, roomName, ydoc, ytext, yconfig, onUsersChange]); // Removed 'language' to prevent reconnect loops

  // NEW: Handle when the local user changes the dropdown
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);          // Update local UI immediately
    yconfig.set('language', newLang); // Broadcast the change to Yjs network
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Editor Toolbar */}
      <div className="bg-gray-800 p-2 flex justify-end items-center border-b border-gray-700 rounded-t-lg">
        <label className="text-sm text-gray-400 mr-3 font-semibold">Language:</label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-700 text-white text-sm rounded-md px-3 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco Container */}
      <div className="grow">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false }, // Optional: hides the minimap for a cleaner look
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;