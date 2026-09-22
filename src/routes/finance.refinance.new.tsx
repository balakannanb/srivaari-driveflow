import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/finance/refinance/new")({
  head: () => ({ meta: [
    { title: "New Refinance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "New Refinance at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "New Refinance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "New Refinance at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="refinance"/>; }
