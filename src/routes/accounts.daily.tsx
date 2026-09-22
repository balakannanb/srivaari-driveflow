import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "@/components/pages";

export const Route = createFileRoute("/accounts/daily")({
  head: () => ({ meta: [
    { title: "Daily Accounts — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Automatic daily showroom transaction summary." },
    { property: "og:title", content: "Daily Accounts — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Automatic daily showroom transaction summary." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <AccountsPage/>; }
