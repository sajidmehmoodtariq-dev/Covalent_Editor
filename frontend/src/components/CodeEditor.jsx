import Editor from '@monaco-editor/react';
import { MonacoBinding } from 'y-monaco';
import { useRef, useMemo } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

const CodeEditor = () => {
  const editorRef = useRef(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText('monaco'), [ydoc]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    const model = editor.getModel();
    if (!model) {
      return;
    }

    const provider = new SocketIOProvider('http://localhost:3000', 'monaco', ydoc, {autoConnect: true});
    new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      provider.awareness
    );
  };

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

export default CodeEditor