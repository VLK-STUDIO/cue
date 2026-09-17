import type { Plugin } from "vite";

/**
 * Nitro's Vite dev middleware 404s extensionless routes when the browser sends
 * `Sec-Fetch-Dest: image` (img tags, social preview plugins). Direct navigation
 * uses `document` and works. Rewrite those requests so `/og` hits the server route.
 *
 * @see https://github.com/TanStack/router/issues/7403
 */
export function ogImageDevFetchFix(): Plugin {
  return {
    name: "og-image-dev-fetch-fix",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split("?")[0] ?? "";
        if (path === "/og" || path.startsWith("/og/")) {
          const dest = req.headers["sec-fetch-dest"];
          if (dest === "image" || dest === "video" || dest === "audio") {
            req.headers["sec-fetch-dest"] = "empty";
          }
        }
        next();
      });
    },
  };
}
