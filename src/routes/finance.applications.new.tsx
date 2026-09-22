import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/finance/applications/new")({
  head: () => ({ meta: [
    { title: "New Finance Application — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Create a finance application from booking data." },
    { property: "og:title", content: "New Finance Application — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Create a finance application from booking data." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="finance"/>; }
