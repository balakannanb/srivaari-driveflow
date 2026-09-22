import { createFileRoute } from "@tanstack/react-router";
import { RecordFormPage } from "@/components/forms";

export const Route = createFileRoute("/bookings/$id/edit")({
  head: () => ({ meta: [
    { title: "Edit Booking — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Edit Booking at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:title", content: "Edit Booking — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Edit Booking at SRIVAARI AUTOMOBILES showroom management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RecordFormPage module="booking" mode="edit" id={Route.useParams().id}/>; }
