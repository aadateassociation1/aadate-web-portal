import React from "react";
import { createRoot } from "react-dom/client";
import { registerServiceWorker } from "./register-sw";
import "./styles.css";

function formatError(error: unknown) {
  if (error instanceof Error) return `${error.message}\n\n${error.stack ?? ""}`.trim();
  return String(error);
}

function showBootError(error: unknown) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;background:#fff;color:#111;font-family:system-ui,-apple-system,Segoe UI,sans-serif;padding:24px">
      <div style="width:min(760px,100%);border:1px solid #ddd;border-radius:8px;padding:20px;background:#fafafa">
        <h1 style="margin:0 0 8px;font-size:20px">Frontend failed to load</h1>
        <p style="margin:0 0 16px;color:#555">This is the runtime error causing the white screen:</p>
        <pre style="white-space:pre-wrap;overflow:auto;background:#111;color:#fff;border-radius:6px;padding:14px;font-size:13px">${formatError(error)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</pre>
      </div>
    </div>
  `;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: unknown }> {
  state = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background p-6 text-foreground">
          <div className="mx-auto max-w-3xl rounded-md border bg-card p-5">
            <h1 className="text-xl font-semibold">Frontend failed to render</h1>
            <p className="mt-2 text-sm text-muted-foreground">This is the runtime error causing the white screen:</p>
            <pre className="mt-4 max-h-[60vh] overflow-auto rounded-md bg-foreground p-4 text-sm text-background">
              {formatError(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

window.addEventListener("error", (event) => showBootError(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => showBootError(event.reason));

async function boot() {
  registerServiceWorker();
  const { default: App } = await import("./App");
  createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

boot().catch((error) => showBootError(error));
