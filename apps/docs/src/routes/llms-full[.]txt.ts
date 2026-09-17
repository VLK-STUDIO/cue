import { createFileRoute } from "@tanstack/react-router";
import { docsLlms } from "@/lib/source";
import { packageName, siteDescription, siteUrl } from "@/lib/shared";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => {
        const full = await docsLlms.full();
        const content = `# cue

> ${siteDescription}

Package: \`${packageName}\`
Website: ${siteUrl}

${full}
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
