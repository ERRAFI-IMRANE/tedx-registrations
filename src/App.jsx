import { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (input === "siidna") {
      setAuthenticated(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (!authenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="logo">
            <span className="ted">TED</span>
            <span className="x">x</span>
          </div>
          <p className="subtitle">Dashboard Access</p>
          <input
            className="login-input"
            type="password"
            placeholder="Enter password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className="login-error">❌ Wrong password</p>}
          <button className="login-btn" onClick={handleLogin}>
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default App;