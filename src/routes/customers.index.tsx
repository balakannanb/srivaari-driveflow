import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/pages";

export const Route = createFileRoute("/customers/")({
  head: () => ({ meta: [
    { title: "Customers — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage customer records and connected showroom journeys." },
    { property: "og:title", content: "Customers — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage customer records and connected showroom journeys." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <CustomersPage/>; }
