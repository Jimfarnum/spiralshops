import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerPush } from "./utils/pushNotifications";

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => {
        registerPush().catch(console.error);
      })
      .catch(err => {
        console.error("SW registration failed:", err);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
