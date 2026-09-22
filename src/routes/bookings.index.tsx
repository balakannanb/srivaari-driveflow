import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/bookings/")({
  head: () => ({ meta: [
    { title: "Bookings — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage cash and finance vehicle bookings." },
    { property: "og:title", content: "Bookings — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage cash and finance vehicle bookings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="bookings"/>; }
