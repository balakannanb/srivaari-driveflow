import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/inventory/new")({
  head: () => ({ meta: [
    { title: "Add Vehicle — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Add a vehicle to showroom inventory." },
    { property: "og:title", content: "Add Vehicle — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Add a vehicle to showroom inventory." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="vehicle"/>; }
