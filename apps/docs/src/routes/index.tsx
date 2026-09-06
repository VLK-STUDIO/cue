import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { appName, githubUrl } from "@/lib/shared";
import { welcomeDialog } from "@/components/overlays";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()} className="relative">
      <div className="om-landing">
        <h1 className="om-landing-title">{appName}</h1>
        <p className="om-landing-tagline">Register a dialog once. Open it from anywhere.</p>
        <div className="om-landing-actions">
          <button
            type="button"
            className="om-button om-button-primary"
            onClick={() => welcomeDialog.open()}
          >
            Open dialog
          </button>
          <a href={githubUrl} className="om-button" target="_blank" rel="noreferrer noopener">
            GitHub →
          </a>
        </div>
        <Link
          to="/docs/$"
          params={{ _splat: "" }}
          className="om-landing-docs"
        >
          Documentation
        </Link>
      </div>
    </HomeLayout>
  );
}
