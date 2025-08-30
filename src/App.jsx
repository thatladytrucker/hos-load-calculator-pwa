import React from "react";

function StatusRow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
      <div style={{ color: "green", fontWeight: "bold" }}>🟢 ONTIME</div>
      <div style={{ color: "blue", fontWeight: "bold" }}>🔵 OK</div>
      <div style={{ color: "red", fontWeight: "bold" }}>🔴 LATE</div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>HOS Load Calculator</h1>
      <p>This app assists with planning. Follow HOS guidelines — you are responsible for your CDL.</p>

      {/* Add the status row here */}
      <StatusRow />

      <div style={{ display: "grid", gap: "15px", maxWidth: "400px", margin: "0 auto" }}>
        <label>
          Arrival (Shipper): <input type="time" />
        </label>
        <label>
          PTA After Stop: <input type="time" />
        </label>
        <label>
          ETA (Final): <input type="time" />
        </label>
        <label>
          PTA After Final: <input type="time" />
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button>Calculate</button>
        <button style={{ marginLeft: "10px" }}>New Trip</button>
      </div>
    </div>
  );
}
