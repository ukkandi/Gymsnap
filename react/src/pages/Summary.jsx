import { useState } from "react";

export default function Summary() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function generate() {
    setOutput(
      "This is where the AI summary will appear once the backend is connected."
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Summary</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your workout..."
        rows="5"
        style={{ width: "100%", marginBottom: "10px" }}
      ></textarea>

      <button onClick={generate}>Generate Summary</button>

      {output && (
        <div style={{ marginTop: "20px" }}>
          <h2>Summary:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
