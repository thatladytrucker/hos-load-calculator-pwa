import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// vite-plugin-pwa will auto-register the service worker
createRoot(document.getElementById("root")).render(<App />);
