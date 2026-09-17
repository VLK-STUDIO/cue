import { createFileRoute, notFound } from "@tanstack/react-router";
import { createOgImageResponse } from "@/lib/og";
import { source } from "@/lib/source";

export const Route = createFileRoute("/og/docs/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const slugs = (params._splat?.split("/") ?? []).filter((segment) => segment.length > 0);
        const page = source.getPage(slugs);
        if (!page) throw notFound();

        return createOgImageResponse({
          request: request,
          title: page.data.title,
          description: page.data.description,
          eyebrow: "cue docs",
        });
      },
    },
  },
});
