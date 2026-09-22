import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/enquiries/$id/")({
  head: () => ({ meta: [
    { title: "Enquiry Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View enquiry information and follow-up progress." },
    { property: "og:title", content: "Enquiry Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View enquiry information and follow-up progress." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="enquiries" id={Route.useParams().id}/>; }
