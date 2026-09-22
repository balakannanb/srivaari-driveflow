import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/pages";

export const Route = createFileRoute("/settings/users")({
  head: () => ({ meta: [
    { title: "Users — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage showroom users and account status." },
    { property: "og:title", content: "Users — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage showroom users and account status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <SettingsPage/>; }
