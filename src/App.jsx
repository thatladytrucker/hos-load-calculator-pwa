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
  // format Date -> yyyy-mm-ddThh:mm for <input type="datetime-local">
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

/** ---- Status logic ----
 * - If final window provided:
 *    - Hard appt if Start === End (to the minute)
 *    - LATE if ETA > End (hard or window)
 *    - OK if inside window and (End - ETA) <= OK_MARGIN_MIN
 *    - ONTIME if inside window with more buffer, or early (ETA < Start)
 * - If no window provided: default to ONTIME (we can still show ETA)
 */
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
