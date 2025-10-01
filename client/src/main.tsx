import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerPush } from "./utils/pushNotifications";

// Remove loading indicator
const loadingEl = document.getElementById("spiral-loading");
if (loadingEl) loadingEl.remove();

const loadStyle = document.getElementById("spiral-load-style");
if (loadStyle) loadStyle.remove();

// Clear service worker cache and unregister to fix routing issue
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
