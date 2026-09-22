import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/finance/applications/")({
  head: () => ({ meta: [
    { title: "Finance Applications — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage customer loan applications across NBFC partners." },
    { property: "og:title", content: "Finance Applications — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage customer loan applications across NBFC partners." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="finance"/>; }
