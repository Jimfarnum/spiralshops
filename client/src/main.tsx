import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("✅ PWA ready"))
      .catch(err => console.error("PWA failed", err));
  });
}

createRoot(document.getElementById("root")!).render(<App />);
