import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { ogImageDevFetchFix } from "./vite.og-dev-fix";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    ogImageDevFetchFix(),
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      // Built-in build-time sitemap is not served by Nitro's public-asset
      // registry. Use the `/sitemap.xml` server route instead:
      // https://tanstack.com/start/latest/docs/framework/react/guide/seo#dynamic-sitemap
      sitemap: {
        enabled: false,
      },
      pages: [
        // Server routes are not link-crawled; list the ones crawlers/agents should hit.
        { path: "/llms.txt" },
        { path: "/llms-full.txt" },
        { path: "/sitemap.xml" },
      ],
    }),
    react(),
    // Railway / Node: https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro
    nitro(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["@vlkoss/cue"],
  },
  ssr: {
    noExternal: ["@vlkoss/cue"],
  },
});
