import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/pages";

export const Route = createFileRoute("/settings/master-data")({
  head: () => ({ meta: [
    { title: "Master Data — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Configure vehicle, partner, category, and payment masters." },
    { property: "og:title", content: "Master Data — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Configure vehicle, partner, category, and payment masters." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <SettingsPage/>; }
