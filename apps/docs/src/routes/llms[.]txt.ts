import { createFileRoute } from "@tanstack/react-router";
import { docsLlms } from "@/lib/source";
import { githubUrl, npmUrl, packageName, siteDescription, siteUrl } from "@/lib/shared";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const index = await docsLlms.index();
        const docsIndex = index.replaceAll("](/", `](${siteUrl}/`);
        const content = `# cue

> ${siteDescription}

Cue is the npm package \`${packageName}\`. Use it when a React app needs programmatic overlays opened from event handlers, effects, or other client code.

## Key facts
- Package: ${packageName}
- License: MIT
- Runtime: React 18+
- Language: TypeScript

## Documentation

${docsIndex}

## Links
- VLK Studio: https://vlkstudio.com
- Website: ${siteUrl}
- GitHub: ${githubUrl}
- npm: ${npmUrl}
- Full docs text: ${siteUrl}/llms-full.txt
`;

        return new Response(content, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});
