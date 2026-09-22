import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/finance/applications/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Finance Application — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Finance Application at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Finance Application — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Finance Application at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="finance" mode="edit" id={Route.useParams().id}/>; }
