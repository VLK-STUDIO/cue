import {
  absoluteUrl,
  appName,
  githubUrl,
  npmUrl,
  organization,
  packageName,
  siteDescription,
  siteUrl,
} from "./shared";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image: string;
  type?: "website" | "article";
};

export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(data),
  };
}

export function pageHead({ title, description, path, image, type = "website" }: PageSeoInput) {
  const url = absoluteUrl(path);
  const imagePath = image.startsWith("http") ? new URL(image).pathname : image;
  // One URL for every image tag. Mixed relative + production absolute makes
  // preview tools fetch cue.vlkstudio.com while you are still on localhost
  // (and production /og still 404s until this branch is deployed).
  // Dev keeps a same-origin path so browser-based previews can load the local route.
  const imageUrl = import.meta.env.DEV
    ? `http://localhost:3000${imagePath}`
    : absoluteUrl(imagePath);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: organization.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:site_name", content: appName },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const softwareId = `${siteUrl}/#software`;

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: organization.name,
        url: organization.url,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
        },
        sameAs: [...organization.sameAs],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: appName,
        url: siteUrl,
        description: siteDescription,
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: packageName,
        alternateName: appName,
        description: siteDescription,
        url: siteUrl,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        programmingLanguage: "TypeScript",
        downloadUrl: npmUrl,
        codeRepository: githubUrl,
        installUrl: npmUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: { "@id": organizationId },
        publisher: { "@id": organizationId },
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${siteUrl}/#source`,
        name: packageName,
        description: siteDescription,
        codeRepository: githubUrl,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React",
        license: "https://opensource.org/licenses/MIT",
        url: githubUrl,
        author: { "@id": organizationId },
      },
    ],
  };
}

export function docsArticleGraph(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  breadcrumbs: Array<{ name: string; path: string }>;
}) {
  const pageUrl = absoluteUrl(input.path);
  const imageUrl = absoluteUrl(input.image);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#article`,
        headline: input.title,
        description: input.description,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        image: imageUrl,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        author: { "@id": organizationId },
        publisher: { "@id": organizationId },
        about: { "@id": softwareId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: input.breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: absoluteUrl(crumb.path),
        })),
      },
    ],
  };
}

export function docsBreadcrumbs(slugs: string[], title: string) {
  const crumbs: Array<{ name: string; path: string }> = [
    { name: "Home", path: "/" },
    { name: "Docs", path: "/docs" },
  ];

  if (slugs.length === 0) {
    crumbs.push({ name: title, path: "/docs" });
    return crumbs;
  }

  let path = "/docs";
  for (let i = 0; i < slugs.length; i++) {
    path += `/${slugs[i]}`;
    crumbs.push({
      name: i === slugs.length - 1 ? title : slugs[i]!,
      path,
    });
  }

  return crumbs;
}
