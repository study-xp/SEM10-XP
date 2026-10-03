import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

function BootStatus({ error }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#3f7ee8",
      color: "#fff",
      fontFamily: "Tahoma, sans-serif",
      padding: 24,
      boxSizing: "border-box",
      textAlign: "center"
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
          {error ? "SEM 10-XP could not start" : "Starting SEM 10-XP…"}
        </div>
        {error && (
          <div style={{ maxWidth: 620, fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap", opacity: 0.9 }}>
            {String(error?.message || error)}
          </div>
        )}
      </div>
    </div>
  );
}

root.render(<BootStatus />);

requestAnimationFrame(async () => {
  try {
    const { default: App } = await import("./App.jsx");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Load DOM enhancers only after the core app has successfully mounted.
    // Each enhancer is isolated so one optional feature cannot blank the app.
    const helpers = [
      "./audio-unlock.js",
      "./mobile-task-search.js",
      "./mobile-ui-fixes.js",
      "./tracker-sort-filter.js",
      "./tracker-bulk-actions.js",
      "./tracker-progress-exclusion.js",
      "./taskbar-boundary.js",
      "./tracker-chapter-options.js",
    ];
    for (const helper of helpers) {
      import(helper).catch((error) => {
        console.error("SEM10-XP optional helper failed:", helper, error);
      });
    }
  } catch (error) {
    console.error("SEM10-XP boot failed:", error);
    root.render(<BootStatus error={error} />);
  }
});
