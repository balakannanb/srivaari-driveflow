import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/components/pages";

export const Route = createFileRoute("/customers/$id/")({
  head: () => ({ meta: [
    { title: "Customer Profile — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "View customer information and complete transaction history." },
    { property: "og:title", content: "Customer Profile — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "View customer information and complete transaction history." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <CustomerDetailPage id={Route.useParams().id}/>; }
