import { useEffect, useState } from "react";
import { rtdb } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const registrationsRef = ref(rtdb, "registrations");

    const unsubscribe = onValue(
      registrationsRef,
      (snapshot) => {
        const data = snapshot.val();
        const list = data ? Object.values(data) : [];

        // ✅ Remove duplicates based on firstName + lastName
        const seen = new Set();
        const unique = list.filter((r) => {
          const key = `${r.firstName?.toLowerCase()}_${r.lastName?.toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setRegistrations(unique);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      },
      (error) => {
        console.error("RTDB error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span className="ted">TED</span>
          <span className="x">x</span>
        </div>
        <p className="subtitle">Registration Dashboard</p>
      </div>

      {/* Stats Card */}
      <div className="card-grid">
        <div className="card main-card">
          <p className="card-label">Total Registrations</p>
          {loading ? (
            <div className="spinner" />
          ) : (
            <h1 className="card-number">{registrations.length}</h1>
          )}
          {lastUpdated && (
            <p className="updated">🟢 Live · Updated at {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Search Navbar */}
      <div className="navbar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍  Search by first or last name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="result-count">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {!loading && (
        <div className="table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-results">
                    No results found
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.uid || i}>
                    <td>{i + 1}</td>
                    <td>{r.firstName}</td>
                    <td>{r.lastName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}