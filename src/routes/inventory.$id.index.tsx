import { createFileRoute } from "@tanstack/react-router";
import { VehicleDetailPage } from "@/components/pages";

export const Route = createFileRoute("/inventory/$id/")({
  head: () => ({ meta: [
    { title: "Vehicle Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View vehicle identity, price, status, and history." },
    { property: "og:title", content: "Vehicle Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View vehicle identity, price, status, and history." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <VehicleDetailPage id={Route.useParams().id}/>; }
