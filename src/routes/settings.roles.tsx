import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/pages";

export const Route = createFileRoute("/settings/roles")({
  head: () => ({ meta: [
    { title: "Roles & Permissions — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Configure secure showroom role permissions." },
    { property: "og:title", content: "Roles & Permissions — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Configure secure showroom role permissions." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <SettingsPage/>; }
