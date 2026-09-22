import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/deliveries/new")({
  head: () => ({ meta: [
    { title: "Schedule Delivery — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Prepare a vehicle for customer handover." },
    { property: "og:title", content: "Schedule Delivery — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Prepare a vehicle for customer handover." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="delivery"/>; }
