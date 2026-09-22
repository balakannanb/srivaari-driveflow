import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/proforma/$id/")({
  head: () => ({ meta: [
    { title: "Proforma Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Review customer, vehicle, and proforma pricing." },
    { property: "og:title", content: "Proforma Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Review customer, vehicle, and proforma pricing." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="proforma" id={Route.useParams().id}/>; }
