import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/insurance/")({
  head: () => ({ meta: [
    { title: "Insurance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage vehicle insurance requests and policies." },
    { property: "og:title", content: "Insurance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage vehicle insurance requests and policies." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="insurance"/>; }
