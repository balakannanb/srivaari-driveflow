import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/registration/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Registration — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Registration at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Registration — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Registration at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="registration" mode="edit" id={Route.useParams().id}/>; }
