import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/finance/refinance/$id/")({
  head: () => ({ meta: [
    { title: "Refinance Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View refinance application progress and documents." },
    { property: "og:title", content: "Refinance Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View refinance application progress and documents." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="refinance" id={Route.useParams().id}/>; }
