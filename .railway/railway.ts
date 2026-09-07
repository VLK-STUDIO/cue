import { defineRailway, github, project, service } from "railway/iac";

/**
 * Shared pnpm/turbo monorepo: keep the service root at the repo root and
 * filter to `docs`. Do not set rootDirectory, or workspace packages break.
 *
 * Plan:  `railway config plan`
 * Apply: `railway config apply`
 */
export default defineRailway(() => {
  const docs = service("docs", {
    source: github("mauroerta/cue", { branch: "main" }),
    build: {
      buildCommand: "pnpm turbo run build --filter=docs",
      watchPatterns: [
        "/apps/docs/**",
        "/packages/react/**",
        "/package.json",
        "/pnpm-lock.yaml",
        "/pnpm-workspace.yaml",
        "/turbo.json",
      ],
    },
    start: "pnpm --filter docs start",
    domains: ["cue.vlkstudio.com"],
    env: {
      NODE_ENV: "production",
    },
  });

  return project("cue", {
    resources: [docs],
  });
});
