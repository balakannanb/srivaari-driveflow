import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "@/components/pages";

export const Route = createFileRoute("/accounts/")({
  head: () => ({ meta: [
    { title: "Accounts — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Track income and expenses without duplicate entry." },
    { property: "og:title", content: "Accounts — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Track income and expenses without duplicate entry." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <AccountsPage/>; }
