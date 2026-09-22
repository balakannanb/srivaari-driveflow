import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/registration/new")({
  head: () => ({ meta: [
    { title: "New Registration — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Create an RTO registration from booking data." },
    { property: "og:title", content: "New Registration — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Create an RTO registration from booking data." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="registration"/>; }
