import { createFileRoute } from "@tanstack/react-router";
import { MastersPage } from "@/components/masters-page";

export const Route = createFileRoute("/masters")({
  head: () => ({ meta: [
    { title: "Masters — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Owner-only masters: branches, dealers, staff, partners, insurance and finance providers." },
    { property: "og:title", content: "Masters — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Owner-only masters: branches, dealers, staff, partners, insurance and finance providers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <MastersPage/>; }
