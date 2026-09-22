import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/pages";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Sales, finance, inventory, accounts, and operations reports." },
    { property: "og:title", content: "Reports — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Sales, finance, inventory, accounts, and operations reports." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ReportsPage/>; }
