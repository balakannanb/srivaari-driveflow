import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/customers/new")({
  head: () => ({ meta: [
    { title: "New Customer — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Create a reusable showroom customer record." },
    { property: "og:title", content: "New Customer — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Create a reusable showroom customer record." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="customer"/>; }
