import { createFileRoute } from "@tanstack/react-router";
import { DeliveryDetailPage } from "@/components/pages";

export const Route = createFileRoute("/deliveries/$id/")({
  head: () => ({ meta: [
    { title: "Delivery Checklist — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Verify prerequisites and complete vehicle delivery." },
    { property: "og:title", content: "Delivery Checklist — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Verify prerequisites and complete vehicle delivery." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DeliveryDetailPage id={Route.useParams().id}/>; }
