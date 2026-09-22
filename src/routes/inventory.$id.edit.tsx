import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/inventory/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Vehicle — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Vehicle at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Vehicle — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Vehicle at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="vehicle" mode="edit" id={Route.useParams().id}/>; }
