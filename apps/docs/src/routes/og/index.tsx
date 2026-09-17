import { createFileRoute } from "@tanstack/react-router";
import { createOgImageResponse } from "@/lib/og";
import { siteDescription } from "@/lib/shared";

export const Route = createFileRoute("/og/")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        createOgImageResponse({
          request: request,
          title: "Programmatic React overlays",
          description: siteDescription,
        }),
    },
  },
});
