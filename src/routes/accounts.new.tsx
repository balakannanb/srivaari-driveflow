import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/accounts/new")({
  head: () => ({ meta: [
    { title: "New Transaction — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "New Transaction at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "New Transaction — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "New Transaction at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="transaction"/>; }
