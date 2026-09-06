import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OverlayProvider } from "@overlay-manager/react";
import { App } from "./app";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(
  <StrictMode>
    <OverlayProvider>
      <App />
    </OverlayProvider>
  </StrictMode>,
);
