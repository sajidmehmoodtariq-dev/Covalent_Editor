import Editor from '@monaco-editor/react';

const CodeEditor = () => {

  function handleEditorChange(value) {
    console.log('here is the current model value:', value);
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      defaultValue='print("Hello world")'
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  )
}

export default CodeEditor