import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "@/components/pages";

export const Route = createFileRoute("/accounts/monthly")({
  head: () => ({ meta: [
    { title: "Monthly Accounts — SRIVAARI AUTOMOBILES" },
    { name: "description", content: "Automatic monthly income, expense, and net summary." },
    { property: "og:title", content: "Monthly Accounts — SRIVAARI AUTOMOBILES" },
    { property: "og:description", content: "Automatic monthly income, expense, and net summary." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Page,
});

function Page() { return <AccountsPage monthly/>; }
