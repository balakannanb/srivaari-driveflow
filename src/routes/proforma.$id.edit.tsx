import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/proforma/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Proforma Invoice — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Proforma Invoice at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Proforma Invoice — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Proforma Invoice at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="proforma" mode="edit" id={Route.useParams().id}/>; }
