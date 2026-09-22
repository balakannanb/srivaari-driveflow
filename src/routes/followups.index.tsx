import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/followups/")({
  head: () => ({ meta: [
    { title: "Follow-ups — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Track customer interest and showroom follow-ups." },
    { property: "og:title", content: "Follow-ups — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Track customer interest and showroom follow-ups." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="followups"/>; }
