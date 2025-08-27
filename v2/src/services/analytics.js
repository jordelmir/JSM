export const trackEvent = (action, category = "User") => {
  if (import.meta.env.MODE === "production") {
    // Solo si el usuario acepta cookies
    if (localStorage.getItem("analytics:enabled") === "true") {
      navigator.sendBeacon("/log", JSON.stringify({ action, category, ts: Date.now() }));
    }
  }
};