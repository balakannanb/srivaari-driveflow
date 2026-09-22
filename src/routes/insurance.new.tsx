import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/insurance/new")({
  head: () => ({ meta: [
    { title: "New Insurance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Start insurance using existing booking information." },
    { property: "og:title", content: "New Insurance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Start insurance using existing booking information." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="insurance"/>; }
