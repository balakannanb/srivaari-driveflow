import { createFileRoute } from "@tanstack/react-router";
import { ListPage } from "@/components/pages";

export const Route = createFileRoute("/proforma/")({
  head: () => ({ meta: [
    { title: "Proforma Invoices — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Create and manage vehicle proforma invoices." },
    { property: "og:title", content: "Proforma Invoices — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Create and manage vehicle proforma invoices." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <ListPage type="proforma"/>; }
