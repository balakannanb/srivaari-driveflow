import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/bookings/new")({
  head: () => ({ meta: [
    { title: "New Booking — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Create a booking from existing customer and enquiry data." },
    { property: "og:title", content: "New Booking — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Create a booking from existing customer and enquiry data." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="booking"/>; }
