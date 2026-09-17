import ImageResponse from "takumi-js/response";
import { CueOgImage, type CueOgImageProps } from "@/components/og-image";

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export async function createOgImageResponse(props: CueOgImageProps) {
  const imageResponse = new ImageResponse(<CueOgImage {...props} />, {
    ...ogImageSize,
    format: "png",
    images: [
      {
        src: "npm",
        data: () =>
          fetch(new URL("/images/npm.png", props.request.url)).then((res) => res.arrayBuffer()),
      },
    ],
  });

  // Buffer so preview tools get Content-Length and can read PNG dimensions.
  await imageResponse.ready;
  const body = await imageResponse.arrayBuffer();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
