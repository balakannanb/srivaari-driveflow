import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/followups/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Follow-up — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Follow-up at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Follow-up — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Follow-up at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="followup" mode="edit" id={Route.useParams().id}/>; }
