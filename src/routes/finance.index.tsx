import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/finance/")({
  head: () => ({ meta: [
    { title: "Finance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Monitor showroom finance applications and disbursals." },
    { property: "og:title", content: "Finance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Monitor showroom finance applications and disbursals." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="finance"/>; }
