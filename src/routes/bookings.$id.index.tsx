import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/pages";

export const Route = createFileRoute("/bookings/$id/")({
  head: () => ({ meta: [
    { title: "Booking Detail — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Track payment, finance, insurance, registration, and delivery." },
    { property: "og:title", content: "Booking Detail — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Track payment, finance, insurance, registration, and delivery." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DetailPage type="bookings" id={Route.useParams().id}/>; }
