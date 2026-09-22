import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/registration/")({
  head: () => ({ meta: [
    { title: "Registration — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Track RTO registration applications to completion." },
    { property: "og:title", content: "Registration — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Track RTO registration applications to completion." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="registration"/>; }
