import Editor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { useState, useMemo, useEffect } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

// Accept the new roomName prop
const CodeEditor = ({ userName, roomName, onUsersChange }) => {
  const [editor, setEditor] = useState(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  
  // You can keep 'monaco' here as the text node identifier within the document
  const ytext = useMemo(() => ydoc.getText('monaco'), [ydoc]);

  const handleEditorDidMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  useEffect(() => {
    if (!editor || !userName || !roomName) return;

    const model = editor.getModel();
    if (!model) return;

    // INJECT THE DYNAMIC ROOM NAME HERE
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
  }, [editor, userName, roomName, ydoc, ytext, onUsersChange]); // Add roomName to dependency array

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