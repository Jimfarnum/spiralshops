async function registerPush() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const reg = await navigator.serviceWorker.ready;

      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        console.warn("⚠️ VITE_VAPID_PUBLIC_KEY not set - push notifications disabled");
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        console.log("✅ Push notifications enabled");
      } else {
        console.error("❌ Push subscription failed:", await response.text());
      }
    } catch (error) {
      console.error("❌ Push registration error:", error);
    }
  }
}

export { registerPush };
