import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState({
    level: "",
    message: "",
    resourceId: "",
    timestamp: "",
    traceId: "",
    spanId: "",
    commit: "",
    parentResourceId: "",
  });
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (filter, value) => {
    setQuery((prevQuery) => ({ ...prevQuery, [filter]: value }));
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Convert the query object to a query string
      const queryString = Object.entries(query)
        .filter(([key, value]) => value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      // Replace 'your-api-endpoint' with the actual endpoint for retrieving logs
      const response = await axios.get(
        `https://dyte.onrender.com/logs?${queryString}`
      );

      setLogs(response.data);
    } catch (err) {
      setError("Error retrieving logs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Log Query</h1>

      <div className="filters">
        <label className="label">
          Level
          <input
            className="input"
            type="text"
            value={query.level}
            onChange={(e) => handleInputChange("level", e.target.value)}
          />
        </label>
        <label>
          Message
          <input
            type="text"
            value={query.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </label>
        <label>
          Resource ID
          <input
            type="text"
            value={query.resourceId}
            onChange={(e) => handleInputChange("resourceId", e.target.value)}
          />
        </label>
        <label>
          Timestamp
          <input
            type="text"
            value={query.timestamp}
            onChange={(e) => handleInputChange("timestamp", e.target.value)}
          />
        </label>
        <label>
          Trace ID
          <input
            type="text"
            value={query.traceId}
            onChange={(e) => handleInputChange("traceId", e.target.value)}
          />
        </label>
        <label>
          Span ID
          <input
            type="text"
            value={query.spanId}
            onChange={(e) => handleInputChange("spanId", e.target.value)}
          />
        </label>
        <label>
          Commit
          <input
            type="text"
            value={query.commit}
            onChange={(e) => handleInputChange("commit", e.target.value)}
          />
        </label>
        <label>
          Parent Resource ID
          <input
            type="text"
            value={query.parentResourceId}
            onChange={(e) =>
              handleInputChange("parentResourceId", e.target.value)
            }
          />
        </label>
      </div>

      <button onClick={handleSearch} disabled={isLoading}>
        Search
      </button>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="results">
        <h2>Results:</h2>
        <ul>
          {logs.map((log, index) => (
            <pre key={index}>{JSON.stringify(log, null, 2)}</pre>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
