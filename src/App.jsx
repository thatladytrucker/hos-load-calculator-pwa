import React, { useState } from "react";

const Capsule = ({ active, color, label }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border
      ${active ? "opacity-100" : "opacity-60"}
    `}
    style={{ borderColor: color }}
  >
    <span style={{ color }}>●</span>
    <span>{label}</span>
  </span>
);

export default function App() {
  const [status, setStatus] = useState("ONTIME");

  return (
    <div className="page">
      <header className="top">
        <h1>HOS Load Calculator</h1>
        <p className="disclaimer">
          This app assists planning. Follow HOS guidelines—you are responsible for your CDL.
        </p>
      </header>

      {/* Status Row: one row, 3 statuses side-by-side */}
      <section className="status-row">
        <button onClick={() => setStatus("ONTIME")} className="chip">
          <Capsule active={status==="ONTIME"} color="#16a34a" label="🟢 ONTIME" />
        </button>
        <button onClick={() => setStatus("OK")} className="chip">
          <Capsule active={status==="OK"} color="#2563eb" label="🔵 OK" />
        </button>
        <button onClick={() => setStatus("LATE")} className="chip">
          <Capsule active={status==="LATE"} color="#dc2626" label="🔴 LATE" />
        </button>
      </section>

      {/* Two rows of fields */}
      <section className="grid">
        <div className="cell">
          <label>Arrival (Shipper)</label>
          <input placeholder="e.g., 08:30" inputMode="numeric" />
        </div>
        <div className="cell">
          <label>PTA After Stop</label>
          <input placeholder="e.g., 10:15" inputMode="numeric" />
        </div>

        <div className="cell">
          <label>ETA (Final)</label>
          <input placeholder="e.g., 14:45" inputMode="numeric" />
        </div>
        <div className="cell">
          <label>PTA After Final</label>
          <input placeholder="e.g., 16:00" inputMode="numeric" />
        </div>
      </section>

      <section className="actions">
        <button className="primary">Calculate</button>
        <button className="ghost">New Trip</button>
      </section>

      <footer className="foot">
        <small>© {new Date().getFullYear()} HOS Calc</small>
      </footer>
    </div>
  );
}
