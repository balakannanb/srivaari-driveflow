import { createFileRoute } from "@tanstack/react-router";
import { DeliveriesPage } from "@/components/pages";

export const Route = createFileRoute("/deliveries/")({
  head: () => ({ meta: [
    { title: "Deliveries — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Coordinate safe, complete vehicle handovers." },
    { property: "og:title", content: "Deliveries — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Coordinate safe, complete vehicle handovers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DeliveriesPage/>; }
