import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const playgroundRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Workspace packages resolve `react` from their own node_modules.
    // Pin both to the playground copy so OverlayProvider and the app share a dispatcher.
    alias: {
      react: path.resolve(playgroundRoot, "node_modules/react"),
      "react-dom": path.resolve(playgroundRoot, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
});
