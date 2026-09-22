import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/insurance/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Insurance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Insurance at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Insurance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Insurance at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="insurance" mode="edit" id={Route.useParams().id}/>; }
