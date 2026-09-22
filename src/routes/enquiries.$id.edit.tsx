import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/enquiries/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Enquiry — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Enquiry at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Enquiry — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Enquiry at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="enquiry" mode="edit" id={Route.useParams().id}/>; }
