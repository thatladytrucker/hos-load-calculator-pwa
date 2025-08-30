import React, { useState } from "react";

/** ---- Editable constants ---- */
const STOP_DWELL_MINUTES = {
  "None / Pass-through": 0,
  "Drop & Hook": 45,
  "Live Load": 120,
  "Live Unload": 120,
  "Fuel Only": 15
};
// “OK” means inside window but tight (<= this many minutes remaining)
const OK_MARGIN_MIN = 30;

/** ---- Helpers ---- */
const toLocalInputValue = (dt) => {
  const pad = (n) => String(n).padStart(2, "0");
  const y = dt.getFullYear();
  const m = pad(dt.getMonth() + 1);
  const d = pad(dt.getDate());
  const h = pad(dt.getHours());
  const mi = pad(dt.getMinutes());
  return `${y}-${m}-${d}T${h}:${mi}`;
};

const fromLocalInputValue = (str) => (str ? new Date(str) : null);

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);

const minutesBetween = (a, b) => Math.round((b - a) / 60000);

const fmt = (date) =>
  date
    ? date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit"
      })
    : "—";

/** ---- Status logic ---- */
const computeStatus = (eta, start, end) => {
  if (!eta || !start || !end) return "ontime";
  const hard = start.getTime() === end.getTime();
  if (eta > end) return "late";
  if (hard) {
    return minutesBetween(eta, end) <= OK_MARGIN_MIN ? "ok" : "ontime";
  }
  const minsLeft = minutesBetween(eta, end);
  if (eta < start) return "ontime";
  if (minsLeft <= OK_MARGIN_MIN) return "ok";
  return "ontime";
};

export default function App() {
  /** Inputs */
  const [ptaStart, setPtaStart] = useState(toLocalInputValue(new Date()));
  const [emptyMiles, setEmptyMiles] = useState("0");
  const [loadedMiles, setLoadedMiles] = useState("0");
  const [mph, setMph] = useState("50");
  const [stopShipper, setStopShipper] = useState("None / Pass-through");
  const [stopFinal, setStopFinal] = useState("None / Pass-through");
  const [apply92, setApply92] = useState(true);

  // Appointments
  const [shipStart, setShipStart] = useState("");
  const [shipEnd, setShipEnd] = useState("");
  const [finalStart, setFinalStart] = useState("");
  const [finalEnd, setFinalEnd] = useState("");

  /** Outputs */
  const [status, setStatus] = useState(null);
  const [out, setOut] = useState({
    arrShipper: null,
    ptaAfterStop: null,
    etaFinal: null,
    ptaAfterFinal: null
  });

  const stopOptions = Object.keys(STOP_DWELL_MINUTES);

  const calculate = () => {
    const start = fromLocalInputValue(ptaStart);
    const em = Math.max(0, parseFloat(emptyMiles || 0));
    const lm = Math.max(0, parseFloat(loadedMiles || 0));
    const speed = Math.max(1, parseFloat(mph || 1));

    const minutesEmpty = (em / speed) * 60;
    const minutesLoaded = (lm / speed) * 60;

    const arrivalShipper = addMinutes(start, minutesEmpty);
    const dwellShipper = STOP_DWELL_MINUTES[stopShipper] || 0;
    const ptaAfterStop = addMinutes(arrivalShipper, dwellShipper);

    let etaFinal = addMinutes(ptaAfterStop, minutesLoaded);
    if (apply92) {
      etaFinal = addMinutes(etaFinal, 120);
    }
    const dwellFinal = STOP_DWELL_MINUTES[stopFinal] || 0;
    const ptaAfterFinal = addMinutes(etaFinal, dwellFinal);

    const fStart = fromLocalInputValue(finalStart);
    const fEnd = fromLocalInputValue(finalEnd);
    const s = computeStatus(etaFinal, fStart, fEnd);

    setOut({
      arrShipper: arrivalShipper,
      ptaAfterStop,
      etaFinal,
      ptaAfterFinal
    });
    setStatus(s);
  };

  const reset = () => {
    setEmptyMiles("0");
    setLoadedMiles("0");
    setMph("50");
    setStopShipper("None / Pass-through");
    setStopFinal("None / Pass-through");
    setApply92(true);
    setShipStart("");
    setShipEnd("");
    setFinalStart("");
    setFinalEnd("");
    setStatus(null);
    setOut({
      arrShipper: null,
      ptaAfterStop: null,
      etaFinal: null,
      ptaAfterFinal: null
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          Toya&apos;s HOS Load Calculator <span className="badge">Base • v6.1b</span>
        </h1>
        <small className="hint">
          This app assists with planning. Follow FMCSA HOS guidelines—you are
          responsible for your CDL. Calculations assume a full 70/14/11 unless noted.
        </small>
      </div>

      {/* Inputs */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Inputs</h3>
        <div className="row">
          <div>
            <label>PTA (Start time)</label>
            <input
              type="datetime-local"
              value={ptaStart}
              onChange={(e) => setPtaStart(e.target.value)}
            />
          </div>
          <div>
            <label>Average MPH</label>
            <input
              inputMode="decimal"
              value={mph}
              onChange={(e) => setMph(e.target.value)}
            />
          </div>
          <div>
            <label>Empty Miles → Shipper</label>
            <input
              inputMode="decimal"
              value={emptyMiles}
              onChange={(e) => setEmptyMiles(e.target.value)}
            />
          </div>
          <div>
            <label>Loaded Miles → Final</label>
            <input
              inputMode="decimal"
              value={loadedMiles}
              onChange={(e) => setLoadedMiles(e.target.value)}
            />
          </div>
          <div>
            <label>Stop Type @ Shipper</label>
            <select
              value={stopShipper}
              onChange={(e) => setStopShipper(e.target.value)}
            >
              {stopOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Stop Type @ Final</label>
            <select
              value={stopFinal}
              onChange={(e) => setStopFinal(e.target.value)}
            >
              {stopOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="row-1" style={{ marginTop: 6 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={apply92}
                onChange={(e) => setApply92(e.target.checked)}
              />
              Apply 9+2 Parking Buffer automatically (+2 hrs)
            </label>
          </div>
        </div>

        <div className="actions">
          <button className="primary" onClick={calculate}>
            Calculate
          </button>
          <button onClick={reset}>New Trip</button>
        </div>
      </div>

      {/* Appointments */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Appointments</h3>
        <div className="row">
          <div>
            <label>Shipper Appt Start</label>
            <input
              type="datetime-local"
              value={shipStart}
              onChange={(e) => setShipStart(e.target.value)}
            />
          </div>
          <div>
            <label>Shipper Appt End</label>
            <input
              type="datetime-local"
              value={shipEnd}
              onChange={(e) => setShipEnd(e.target.value)}
            />
          </div>
          <div>
            <label>Final Appt Start</label>
            <input
              type="datetime-local"
              value={finalStart}
              onChange={(e) => setFinalStart(e.target.value)}
            />
          </div>
          <div>
            <label>Final Appt End</label>
            <input
              type="datetime-local"
              value={finalEnd}
              onChange={(e) => setFinalEnd(e.target.value)}
            />
          </div>
        </div>
        <small className="hint">
          Hard appt: set Start = End (e.g., 10:00–10:00). Window appt: set a
          range (e.g., 10:00–23:59). “OK” = inside window with ≤ {OK_MARGIN_MIN}m remaining.
        </small>
      </div>

      {/* STATUS ROW */}
      <div className="card" style={{ paddingTop: 12 }}>
        <div className="status-row" aria-label="Status">
          <div className={"status-pill green" + (status === "ontime" ? " active" : "")}>
            ONTIME
          </div>
          <div className={"status-pill blue" + (status === "ok" ? " active" : "")}>
            OK
          </div>
          <div className={"status-pill red" + (status === "late" ? " active" : "")}>
            LATE
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="outputs" aria-label="Outputs">
          <div className="pill">
            <div className="label">Arrival (Shipper)</div>
            <div className="value">{fmt(out.arrShipper)}</div>
          </div>
          <div className="pill">
            <div className="label">PTA After Stop</div>
            <div className="value">{fmt(out.ptaAfterStop)}</div>
          </div>
          <div className="pill">
            <div className="label">ETA (Final)</div>
            <div className="value">{fmt(out.etaFinal)}</div>
          </div>
          <div className="pill">
            <div className="label">PTA After Final</div>
            <div className="value">{fmt(out.ptaAfterFinal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
