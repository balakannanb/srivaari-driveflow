import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/followups/$id/")({
  head: () => ({ meta: [
    { title: "Follow-up Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View followup information and follow-up progress." },
    { property: "og:title", content: "Follow-up Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View followup information and follow-up progress." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="followups" id={Route.useParams().id}/>; }
