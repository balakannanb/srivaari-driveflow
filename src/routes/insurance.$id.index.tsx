import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/insurance/$id/")({
  head: () => ({ meta: [
    { title: "Insurance Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View policy, premium, dates, and documents." },
    { property: "og:title", content: "Insurance Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View policy, premium, dates, and documents." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="insurance" id={Route.useParams().id}/>; }
