import { createFileRoute } from "@tanstack/react-router";
import { RefinancePage } from "@/components/pages";

export const Route = createFileRoute("/finance/refinance/")({
  head: () => ({ meta: [
    { title: "Refinance — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Manage refinance enquiries and applications." },
    { property: "og:title", content: "Refinance — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Manage refinance enquiries and applications." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <RefinancePage/>; }
