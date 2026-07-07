import Editor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { useState, useMemo, useEffect } from 'react'; // Swapped useRef for useState
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

const CodeEditor = ({ userName }) => {
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

    const provider = new SocketIOProvider('http://localhost:3000', 'monaco', ydoc, { autoConnect: true });
    
    provider.awareness.setLocalStateField('user', { name: userName });

    const binding = new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      provider.awareness
    );

    return () => {
      binding.destroy();
      provider.disconnect();
    };
  }, [editor, userName, ydoc, ytext]);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      defaultValue="print('Hello world')"
      theme="vs-dark"
      onMount={handleEditorDidMount}
    />
  );
};

export default CodeEditor;