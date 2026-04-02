import { useEffect, useState } from "react";
import { rtdb } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function Dashboard() {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const registrationsRef = ref(rtdb, "registrations");

    const unsubscribe = onValue(
      registrationsRef,
      (snapshot) => {
        const data = snapshot.val();
        const count = data ? Object.keys(data).length : 0;
        setTotal(count);
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

  return (
    <div className="dashboard">
      <div className="header">
        <div className="logo">
          <span className="ted">TED</span>
          <span className="x">x</span>
        </div>
        <p className="subtitle">Registration Dashboard</p>
      </div>

      <div className="card-grid">
        <div className="card main-card">
          <p className="card-label">Total Registrations</p>
          {loading ? (
            <div className="spinner" />
          ) : (
            <h1 className="card-number">{total}</h1>
          )}
          {lastUpdated && (
            <p className="updated">🟢 Live · Updated at {lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  );
}