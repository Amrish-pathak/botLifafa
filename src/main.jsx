import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove instant HTML splash after React starts
requestAnimationFrame(() => {
  const splash = document.getElementById("startup-splash");

  if (splash) {
    splash.style.opacity = "0";
    splash.style.transition = "opacity 180ms ease";

    setTimeout(() => {
      splash.remove();
      document.body.style.overflow = "";
    }, 180);
  }
});
