import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/pages";

export const Route = createFileRoute("/settings/")({
  head: () => ({ meta: [
    { title: "Settings — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Configure showroom information and operating preferences." },
    { property: "og:title", content: "Settings — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Configure showroom information and operating preferences." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <SettingsPage/>; }
