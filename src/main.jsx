import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Load optional DOM enhancers after the React app has mounted.
// A failure in one enhancer must never prevent the core app from rendering.
requestAnimationFrame(() => {
  Promise.allSettled([
    import("./audio-unlock.js"),
    import("./mobile-task-search.js"),
    import("./mobile-ui-fixes.js"),
    import("./tracker-sort-filter.js"),
    import("./tracker-bulk-actions.js"),
    import("./tracker-progress-exclusion.js"),
    import("./taskbar-boundary.js"),
    import("./tracker-chapter-options.js"),
  ]).catch(() => {});
});
