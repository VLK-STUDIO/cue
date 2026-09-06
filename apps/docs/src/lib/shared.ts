export const appName = "overlay-manager";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

export const gitConfig = {
  user: "mauroerta",
  repo: "overlay-manager",
  branch: "main",
};

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function encodeMarkdownUrl(slugs: string[], locale?: string) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return "/" + [locale, ...docsRoute.split("/"), ...segments].filter(Boolean).join("/");
}

/** @returns page slugs */
export function decodeMarkdownUrl(segments: string[]) {
  if (segments.length === 0) return [];

  const out = [...segments];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, "");
  if (out.length === 1 && out[0] === "index") out.pop();
  return out;
}
