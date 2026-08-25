import React from "react";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>React-App build</h1>
      <p><strong>Title:</strong> {process.env.REACT_APP_TITLE}</p>
      <p><strong>Version:</strong> {process.env.REACT_APP_VERSION}</p>
      <p>Follows a complete DevOps end-to-end pipeline</p>
    </div>
  );
}

export default App;
