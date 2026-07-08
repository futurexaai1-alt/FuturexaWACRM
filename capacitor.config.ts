import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ai.futurexa.wacrm",
  appName: "Futurexa WACRM",
  // Capacitor requires a webDir even when loading from a remote URL.
  // This directory holds a minimal fallback page; the real UI comes
  // from the server configured below.
  webDir: "www",
  server: {
    // Load the deployed Next.js app instead of local static files.
    url: "https://wa.futurexa.ai",
    // Allow navigation to any page on the same origin.
    cleartext: false,
  },
  android: {
    // Allow mixed content if your server ever serves http assets
    // (unlikely with HSTS, but safe to have).
    allowMixedContent: false,
  },
  ios: {
    // Use WKWebView (default and recommended).
    contentInset: "automatic",
  },
};

export default config;
