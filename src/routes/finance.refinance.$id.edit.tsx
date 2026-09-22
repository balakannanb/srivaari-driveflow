import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/finance/refinance/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Refinance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Refinance at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Refinance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Refinance at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="refinance" mode="edit" id={Route.useParams().id}/>; }
