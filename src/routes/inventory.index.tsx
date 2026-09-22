import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "@/components/pages";

export const Route = createFileRoute("/inventory/")({
  head: () => ({ meta: [
    { title: "Vehicle Inventory — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage available, reserved, booked, and delivered vehicles." },
    { property: "og:title", content: "Vehicle Inventory — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage available, reserved, booked, and delivered vehicles." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <InventoryPage/>; }
