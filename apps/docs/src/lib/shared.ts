import { createGetUrl } from "fumadocs-core/source";

export const appName = "cue";
export const packageName = "@vlkoss/cue";
export const siteUrl = "https://cue.vlkstudio.com";
export const siteDescription = "The simplest way to manage programmatic overlays in React.";

export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const homeImageRoute = "/og";

export const gitConfig = {
  user: "VLK-STUDIO",
  repo: "cue",
  branch: "main",
};

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
export const npmUrl = `https://www.npmjs.com/package/${packageName}`;

export const organization = {
  name: "VLK Studio",
  url: siteUrl,
  sameAs: [githubUrl, npmUrl] as const,
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized === "/" ? "/" : normalized}`;
}

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

const getDocsUrl = createGetUrl(docsRoute);
const getImageUrl = createGetUrl(docsImageRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs];
  if (segments.length === 0) {
    segments.push("index.md");
  } else {
    segments[segments.length - 1] += ".md";
  }

  return { segments, url: getDocsUrl(segments, page.locale) };
}

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  // No file extension: Vite treats `.webp`/`.png` as static assets and never hits the route.
  const segments = [...page.slugs];

  return { segments, url: getImageUrl(segments, page.locale) };
}
