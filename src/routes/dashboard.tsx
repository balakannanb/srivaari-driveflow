import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/pages";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Live showroom operations, bookings, finance, inventory, and deliveries." },
    { property: "og:title", content: "Dashboard — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Live showroom operations, bookings, finance, inventory, and deliveries." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <DashboardPage/>; }
