import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/registration/$id/")({
  head: () => ({ meta: [
    { title: "Registration Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View RTO application, number, documents, and timeline." },
    { property: "og:title", content: "Registration Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View RTO application, number, documents, and timeline." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="registration" id={Route.useParams().id}/>; }
