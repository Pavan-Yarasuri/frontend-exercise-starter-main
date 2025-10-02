import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./reset.css";

async function boot() {
  // During development we start MSW. When running Cypress tests, the
  // browser's Service Worker will intercept fetches before Cypress can
  // observe them. Skip starting MSW when Cypress is active so tests can
  // reliably use cy.intercept().
  if (import.meta.env.DEV && !(window as any).Cypress) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      serviceWorker: { url: "/mockServiceWorker.js" },
      onUnhandledRequest: "warn",
    });

    console.info("[MSW] worker started");
    console.info(
      "[Starter] Open DevTools → Console and run:",
      "await (await fetch('/products?page=1&limit=8')).json()"
    );
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
boot();
