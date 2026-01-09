import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry";
import { initPerformanceMonitoring, logNavigationMetrics, monitorResourceLoading } from "./lib/performance";

// Initialize Sentry error tracking
initSentry();

// Initialize performance monitoring
initPerformanceMonitoring();

// Log navigation metrics after page load
window.addEventListener('load', () => {
  // Wait a bit for all metrics to be collected
  setTimeout(() => {
    logNavigationMetrics();
    monitorResourceLoading();
  }, 0);
});

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
  