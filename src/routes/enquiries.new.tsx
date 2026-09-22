import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/enquiries/new")({
  head: () => ({ meta: [
    { title: "New Enquiry — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Create a vehicle enquiry using reusable customer data." },
    { property: "og:title", content: "New Enquiry — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Create a vehicle enquiry using reusable customer data." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="enquiry"/>; }
