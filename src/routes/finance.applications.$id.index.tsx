import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/finance/applications/$id/")({
  head: () => ({ meta: [
    { title: "Finance Application — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Review loan terms, documents, approval, and disbursal." },
    { property: "og:title", content: "Finance Application — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Review loan terms, documents, approval, and disbursal." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="finance" id={Route.useParams().id}/>; }
