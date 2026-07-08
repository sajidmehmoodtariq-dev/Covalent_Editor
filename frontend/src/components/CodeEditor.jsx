import Editor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { useState, useMemo, useEffect } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

const CodeEditor = ({ userName, onUsersChange }) => {
  const [editor, setEditor] = useState(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText('monaco'), [ydoc]);

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  useEffect(() => {
    if (!editor || !userName) return;

    const model = editor.getModel();
    if (!model) return;

    const provider = new SocketIOProvider('/', 'monaco', ydoc, { autoConnect: true });
    
    provider.awareness.setLocalStateField('user', { name: userName });

    // NEW: Function to grab all connected users from the awareness protocol
    const updateUsersList = () => {
      const states = provider.awareness.getStates();
      const usersArray = [];
      
      // Loop through all active client states
      states.forEach((state) => {
        if (state.user && state.user.name) {
          usersArray.push(state.user.name);
        }
      });

      // Filter out duplicate names (in case a user opens multiple tabs)
      const uniqueUsers = [...new Set(usersArray)];
      
      if (onUsersChange) {
        onUsersChange(uniqueUsers); // Send the updated list back to App.js
      }
    };

    // Listen to changes (people joining/leaving)
    provider.awareness.on('change', updateUsersList);
    
    // Call it once immediately to grab anyone already in the room
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
  }, [editor, userName, ydoc, ytext, onUsersChange]); 

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      defaultValue='print("Hello world")'
      theme="vs-dark"
      onMount={handleEditorDidMount}
    />
  );
};

export default CodeEditor;